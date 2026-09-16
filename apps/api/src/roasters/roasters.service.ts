import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { slugify } from '../common/slugify.js';
import type { CreateRoasterDto } from './dto/create-roaster.dto.js';
import type { UpdateRoasterDto } from './dto/update-roaster.dto.js';

@Injectable()
export class RoastersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRoasterDto) {
    const slug = slugify(dto.name);
    await this.ensureNameIsFree(dto.name, slug);

    return this.prisma.roaster.create({ data: { ...dto, slug } });
  }

  findAll(search?: string) {
    return this.prisma.roaster.findMany({
      where: search ? { name: { contains: search, mode: 'insensitive' } } : undefined,
      orderBy: { name: 'asc' },
      include: { _count: { select: { coffees: true } } },
    });
  }

  async findOne(id: string) {
    const roaster = await this.prisma.roaster.findUnique({
      where: { id },
      include: { coffees: { orderBy: { name: 'asc' } } },
    });

    if (!roaster) {
      throw new NotFoundException(`Torrefação ${id} não encontrada`);
    }

    return roaster;
  }

  async update(id: string, dto: UpdateRoasterDto) {
    await this.findOne(id);

    const slug = dto.name ? slugify(dto.name) : undefined;
    if (dto.name && slug) {
      await this.ensureNameIsFree(dto.name, slug, id);
    }

    return this.prisma.roaster.update({
      where: { id },
      data: { ...dto, ...(slug ? { slug } : {}) },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.roaster.delete({ where: { id } });

    return { id, deleted: true };
  }

  /** Nome e slug são únicos: valida antes de gravar para devolver 409 em vez de erro do banco. */
  private async ensureNameIsFree(name: string, slug: string, ignoreId?: string) {
    const existing = await this.prisma.roaster.findFirst({
      where: { OR: [{ name }, { slug }], ...(ignoreId ? { NOT: { id: ignoreId } } : {}) },
    });

    if (existing) {
      throw new ConflictException(`Já existe uma torrefação chamada "${name}"`);
    }
  }
}

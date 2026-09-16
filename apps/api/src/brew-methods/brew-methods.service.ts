import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { slugify } from '../common/slugify.js';
import type { CreateBrewMethodDto } from './dto/create-brew-method.dto.js';
import type { UpdateBrewMethodDto } from './dto/update-brew-method.dto.js';

@Injectable()
export class BrewMethodsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBrewMethodDto) {
    await this.ensureNameIsFree(dto.name);

    return this.prisma.brewMethod.create({ data: { ...dto, slug: slugify(dto.name) } });
  }

  findAll() {
    return this.prisma.brewMethod.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { coffees: true } } },
    });
  }

  async findOne(id: string) {
    const method = await this.prisma.brewMethod.findUnique({
      where: { id },
      include: { coffees: { select: { id: true, name: true, slug: true } } },
    });

    if (!method) {
      throw new NotFoundException(`Método de preparo ${id} não encontrado`);
    }

    return method;
  }

  async update(id: string, dto: UpdateBrewMethodDto) {
    await this.findOne(id);

    if (dto.name) {
      await this.ensureNameIsFree(dto.name, id);
    }

    return this.prisma.brewMethod.update({
      where: { id },
      data: { ...dto, ...(dto.name ? { slug: slugify(dto.name) } : {}) },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.brewMethod.delete({ where: { id } });

    return { id, deleted: true };
  }

  private async ensureNameIsFree(name: string, ignoreId?: string) {
    const existing = await this.prisma.brewMethod.findFirst({
      where: { OR: [{ name }, { slug: slugify(name) }], ...(ignoreId ? { NOT: { id: ignoreId } } : {}) },
    });

    if (existing) {
      throw new ConflictException(`O método de preparo "${name}" já existe`);
    }
  }
}

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { slugify } from '../common/slugify.js';
import type { CreateFlavorNoteDto } from './dto/create-flavor-note.dto.js';
import type { UpdateFlavorNoteDto } from './dto/update-flavor-note.dto.js';

@Injectable()
export class FlavorNotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFlavorNoteDto) {
    await this.ensureNameIsFree(dto.name);

    return this.prisma.flavorNote.create({ data: { name: dto.name, slug: slugify(dto.name) } });
  }

  findAll() {
    return this.prisma.flavorNote.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { coffees: true } } },
    });
  }

  async findOne(id: string) {
    const note = await this.prisma.flavorNote.findUnique({
      where: { id },
      include: { coffees: { select: { id: true, name: true, slug: true } } },
    });

    if (!note) {
      throw new NotFoundException(`Nota sensorial ${id} não encontrada`);
    }

    return note;
  }

  async update(id: string, dto: UpdateFlavorNoteDto) {
    await this.findOne(id);

    if (dto.name) {
      await this.ensureNameIsFree(dto.name, id);
    }

    return this.prisma.flavorNote.update({
      where: { id },
      data: dto.name ? { name: dto.name, slug: slugify(dto.name) } : {},
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.flavorNote.delete({ where: { id } });

    return { id, deleted: true };
  }

  private async ensureNameIsFree(name: string, ignoreId?: string) {
    const existing = await this.prisma.flavorNote.findFirst({
      where: { OR: [{ name }, { slug: slugify(name) }], ...(ignoreId ? { NOT: { id: ignoreId } } : {}) },
    });

    if (existing) {
      throw new ConflictException(`A nota sensorial "${name}" já existe`);
    }
  }
}

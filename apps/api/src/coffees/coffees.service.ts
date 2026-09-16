import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { slugify } from '../common/slugify.js';
import type { Prisma } from '../generated/prisma/client.js';
import type { CreateCoffeeDto } from './dto/create-coffee.dto.js';
import type { UpdateCoffeeDto } from './dto/update-coffee.dto.js';
import type { QueryCoffeesDto } from './dto/query-coffees.dto.js';

const INCLUDE_RELATIONS = {
  roaster: true,
  flavorNotes: { orderBy: { name: 'asc' } },
  brewMethods: { orderBy: { name: 'asc' } },
} satisfies Prisma.CoffeeInclude;

@Injectable()
export class CoffeesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCoffeeDto) {
    const { roasterId, flavorNoteIds, brewMethodIds, ...data } = dto;
    await this.ensureRoasterExists(roasterId);

    return this.prisma.coffee.create({
      data: {
        ...data,
        slug: await this.buildUniqueSlug(dto.name),
        roaster: { connect: { id: roasterId } },
        flavorNotes: flavorNoteIds?.length ? { connect: flavorNoteIds.map((id) => ({ id })) } : undefined,
        brewMethods: brewMethodIds?.length ? { connect: brewMethodIds.map((id) => ({ id })) } : undefined,
      },
      include: INCLUDE_RELATIONS,
    });
  }

  /** Listagem paginada da vitrine, com todos os filtros de descoberta. */
  async findAll(query: QueryCoffeesDto) {
    const page = query.page ?? 1;
    const perPage = Math.min(query.perPage ?? 12, 60);
    const where = this.buildWhere(query);

    const [total, items] = await this.prisma.$transaction([
      this.prisma.coffee.count({ where }),
      this.prisma.coffee.findMany({
        where,
        include: INCLUDE_RELATIONS,
        orderBy: this.buildOrderBy(query.sort),
        skip: (page - 1) * perPage,
        take: perPage,
      }),
    ]);

    return {
      items,
      meta: { total, page, perPage, totalPages: Math.max(1, Math.ceil(total / perPage)) },
    };
  }

  async findOne(idOrSlug: string) {
    const coffee = await this.prisma.coffee.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      include: INCLUDE_RELATIONS,
    });

    if (!coffee) {
      throw new NotFoundException(`Café "${idOrSlug}" não encontrado`);
    }

    return coffee;
  }

  async update(id: string, dto: UpdateCoffeeDto) {
    await this.findOne(id);
    const { roasterId, flavorNoteIds, brewMethodIds, ...data } = dto;

    if (roasterId) {
      await this.ensureRoasterExists(roasterId);
    }

    return this.prisma.coffee.update({
      where: { id },
      data: {
        ...data,
        ...(dto.name ? { slug: await this.buildUniqueSlug(dto.name, id) } : {}),
        ...(roasterId ? { roaster: { connect: { id: roasterId } } } : {}),
        // `set` substitui o vínculo inteiro: o cliente envia a lista final desejada.
        ...(flavorNoteIds ? { flavorNotes: { set: flavorNoteIds.map((noteId) => ({ id: noteId })) } } : {}),
        ...(brewMethodIds ? { brewMethods: { set: brewMethodIds.map((methodId) => ({ id: methodId })) } } : {}),
      },
      include: INCLUDE_RELATIONS,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.coffee.delete({ where: { id } });

    return { id, deleted: true };
  }

  /** Registra o clique de saída e devolve o destino na loja parceira. */
  async registerRedirect(idOrSlug: string) {
    const coffee = await this.findOne(idOrSlug);
    const updated = await this.prisma.coffee.update({
      where: { id: coffee.id },
      data: { clickCount: { increment: 1 } },
      select: { storeUrl: true, clickCount: true },
    });

    return { storeUrl: updated.storeUrl, clickCount: updated.clickCount };
  }

  private buildWhere(query: QueryCoffeesDto): Prisma.CoffeeWhereInput {
    const onlyActive = query.onlyActive ?? true;

    if (query.minPrice != null && query.maxPrice != null && query.minPrice > query.maxPrice) {
      throw new BadRequestException('minPrice não pode ser maior que maxPrice');
    }

    return {
      ...(onlyActive ? { active: true } : {}),
      ...(query.beanType ? { beanType: query.beanType } : {}),
      ...(query.roastLevel ? { roastLevel: query.roastLevel } : {}),
      ...(query.process ? { process: query.process } : {}),
      ...(query.roaster ? { roaster: { slug: query.roaster } } : {}),
      ...(query.brewMethod ? { brewMethods: { some: { slug: query.brewMethod } } } : {}),
      ...(query.flavorNote ? { flavorNotes: { some: { slug: query.flavorNote } } } : {}),
      ...(query.minPrice != null || query.maxPrice != null
        ? { priceCents: { ...(query.minPrice != null ? { gte: query.minPrice } : {}), ...(query.maxPrice != null ? { lte: query.maxPrice } : {}) } }
        : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' } },
              { description: { contains: query.search, mode: 'insensitive' } },
              { origin: { contains: query.search, mode: 'insensitive' } },
              { roaster: { name: { contains: query.search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };
  }

  private buildOrderBy(sort?: QueryCoffeesDto['sort']): Prisma.CoffeeOrderByWithRelationInput {
    switch (sort) {
      case 'preco-asc':
        return { priceCents: 'asc' };
      case 'preco-desc':
        return { priceCents: 'desc' };
      case 'nota':
        return { scaScore: 'desc' };
      default:
        return { createdAt: 'desc' };
    }
  }

  private async ensureRoasterExists(roasterId: string) {
    const roaster = await this.prisma.roaster.findUnique({ where: { id: roasterId } });

    if (!roaster) {
      throw new NotFoundException(`Torrefação ${roasterId} não encontrada`);
    }
  }

  /** Dois cafés podem ter o mesmo nome em torrefações diferentes; o slug recebe um sufixo. */
  private async buildUniqueSlug(name: string, ignoreId?: string) {
    const base = slugify(name);
    let slug = base;
    let suffix = 2;

    while (
      await this.prisma.coffee.findFirst({
        where: { slug, ...(ignoreId ? { NOT: { id: ignoreId } } : {}) },
        select: { id: true },
      })
    ) {
      slug = `${base}-${suffix++}`;
    }

    return slug;
  }
}

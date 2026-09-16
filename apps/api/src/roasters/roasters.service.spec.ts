import { ConflictException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RoastersService } from './roasters.service.js';
import type { PrismaService } from '../prisma/prisma.service.js';

/** Prisma dublê: os testes cobrem as regras do serviço, não o banco. */
function createPrismaMock() {
  return {
    roaster: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };
}

describe('RoastersService', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let service: RoastersService;

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new RoastersService(prisma as unknown as PrismaService);
  });

  it('gera o slug a partir do nome ao criar', async () => {
    prisma.roaster.findFirst.mockResolvedValue(null);
    prisma.roaster.create.mockImplementation(({ data }: any) => Promise.resolve({ id: '1', ...data }));

    const created = await service.create({
      name: 'Torrefação Serra Azul',
      websiteUrl: 'https://exemplo.com.br',
    });

    expect(created.slug).toBe('torrefacao-serra-azul');
  });

  it('recusa nome duplicado com 409', async () => {
    prisma.roaster.findFirst.mockResolvedValue({ id: 'existente' });

    await expect(
      service.create({ name: 'Casa do Grão', websiteUrl: 'https://exemplo.com.br' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('devolve 404 ao buscar uma torrefação inexistente', async () => {
    prisma.roaster.findUnique.mockResolvedValue(null);

    await expect(service.findOne('id-inexistente')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('não deleta antes de confirmar que o registro existe', async () => {
    prisma.roaster.findUnique.mockResolvedValue(null);

    await expect(service.remove('id-inexistente')).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.roaster.delete).not.toHaveBeenCalled();
  });
});

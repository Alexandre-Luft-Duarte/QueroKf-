import { describe, expect, it } from 'vitest';
import { slugify } from './slugify.js';

describe('slugify', () => {
  it('remove acentos e normaliza para minúsculas', () => {
    expect(slugify('Café do Sítio')).toBe('cafe-do-sitio');
  });

  it('troca pontuação e espaços por hífens simples', () => {
    expect(slugify('Bourbon  Amarelo / Natural!')).toBe('bourbon-amarelo-natural');
  });

  it('não deixa hífens nas pontas', () => {
    expect(slugify('  --Geisha--  ')).toBe('geisha');
  });
});

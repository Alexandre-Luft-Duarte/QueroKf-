import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { BeanType, Process, RoastLevel } from '../src/generated/prisma/enums.js';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const flavorNotes = [
  'Chocolate amargo',
  'Caramelo',
  'Frutas vermelhas',
  'Castanhas',
  'Cítrico',
  'Floral',
  'Mel',
  'Especiarias',
];

const brewMethods = [
  { name: 'Espresso', description: 'Extração sob pressão, corpo intenso e crema.' },
  { name: 'Hario V60', description: 'Método filtrado que valoriza acidez e notas florais.' },
  { name: 'Prensa francesa', description: 'Imersão total, corpo encorpado e textura densa.' },
  { name: 'Aeropress', description: 'Versátil e rápido, bom para xícaras limpas e concentradas.' },
  { name: 'Coador de pano', description: 'O clássico brasileiro: doçura e corpo equilibrados.' },
];

const roasters = [
  {
    name: 'Torrefação Serra Azul',
    description: 'Micro torrefação da Mantiqueira focada em lotes de alta pontuação.',
    websiteUrl: 'https://exemplo-serraazul.com.br',
    city: 'Campos do Jordão',
    state: 'SP',
  },
  {
    name: 'Casa do Grão',
    description: 'Cafés de origem única do Cerrado Mineiro, torra artesanal em pequenos lotes.',
    websiteUrl: 'https://exemplo-casadograo.com.br',
    city: 'Patrocínio',
    state: 'MG',
  },
  {
    name: 'Café Matinal',
    description: 'Blends autorais pensados para espresso e métodos coados do dia a dia.',
    websiteUrl: 'https://exemplo-matinal.com.br',
    city: 'Curitiba',
    state: 'PR',
  },
];

const coffees = [
  {
    name: 'Bourbon Amarelo Natural',
    roaster: 'Torrefação Serra Azul',
    description: 'Doçura intensa de caramelo, corpo aveludado e final prolongado.',
    priceCents: 5490,
    weightGrams: 250,
    beanType: BeanType.ARABICA,
    roastLevel: RoastLevel.MEDIA,
    process: Process.NATURAL,
    origin: 'Serra da Mantiqueira',
    region: 'Campos do Jordão',
    altitude: 1350,
    scaScore: 86,
    notes: ['Caramelo', 'Castanhas', 'Chocolate amargo'],
    methods: ['Espresso', 'Prensa francesa'],
  },
  {
    name: 'Catuaí Vermelho Cereja Descascado',
    roaster: 'Torrefação Serra Azul',
    description: 'Acidez cítrica equilibrada, doçura de mel e aroma floral.',
    priceCents: 6290,
    weightGrams: 250,
    beanType: BeanType.ARABICA,
    roastLevel: RoastLevel.CLARA,
    process: Process.CEREJA_DESCASCADO,
    origin: 'Serra da Mantiqueira',
    region: 'Santo Antônio do Pinhal',
    altitude: 1250,
    scaScore: 88,
    notes: ['Cítrico', 'Mel', 'Floral'],
    methods: ['Hario V60', 'Aeropress'],
  },
  {
    name: 'Cerrado Mineiro Lavado',
    roaster: 'Casa do Grão',
    description: 'Xícara limpa e equilibrada, ótima porta de entrada para cafés especiais.',
    priceCents: 4190,
    weightGrams: 500,
    beanType: BeanType.ARABICA,
    roastLevel: RoastLevel.MEDIA,
    process: Process.LAVADO,
    origin: 'Cerrado Mineiro',
    region: 'Patrocínio',
    altitude: 1100,
    scaScore: 83,
    notes: ['Chocolate amargo', 'Castanhas'],
    methods: ['Coador de pano', 'Espresso'],
  },
  {
    name: 'Geisha Fermentado',
    roaster: 'Casa do Grão',
    description: 'Lote experimental com fermentação anaeróbica: frutas vermelhas e jasmim.',
    priceCents: 12900,
    weightGrams: 150,
    beanType: BeanType.ARABICA,
    roastLevel: RoastLevel.CLARA,
    process: Process.FERMENTADO,
    origin: 'Cerrado Mineiro',
    region: 'Serra do Salitre',
    altitude: 1200,
    scaScore: 91,
    notes: ['Frutas vermelhas', 'Floral', 'Especiarias'],
    methods: ['Hario V60'],
  },
  {
    name: 'Blend Manhã Clássica',
    roaster: 'Café Matinal',
    description: 'Blend de arábica e conilon para um espresso encorpado com crema densa.',
    priceCents: 3490,
    weightGrams: 500,
    beanType: BeanType.BLEND,
    roastLevel: RoastLevel.ESCURA,
    process: Process.NATURAL,
    origin: 'Brasil',
    region: 'Sul de Minas e Espírito Santo',
    scaScore: 80,
    notes: ['Chocolate amargo', 'Especiarias'],
    methods: ['Espresso', 'Coador de pano'],
  },
  {
    name: 'Honey Amarelo do Sul de Minas',
    roaster: 'Café Matinal',
    description: 'Processo honey com doçura pronunciada e acidez suave de frutas amarelas.',
    priceCents: 5890,
    weightGrams: 250,
    beanType: BeanType.ARABICA,
    roastLevel: RoastLevel.MEDIA_ESCURA,
    process: Process.HONEY,
    origin: 'Sul de Minas',
    region: 'Carmo de Minas',
    altitude: 1150,
    scaScore: 85,
    notes: ['Mel', 'Caramelo', 'Cítrico'],
    methods: ['Aeropress', 'Prensa francesa'],
  },
];

async function main() {
  console.log('Limpando dados existentes...');
  await prisma.coffee.deleteMany();
  await prisma.roaster.deleteMany();
  await prisma.flavorNote.deleteMany();
  await prisma.brewMethod.deleteMany();

  console.log('Criando notas sensoriais e métodos de preparo...');
  await prisma.flavorNote.createMany({
    data: flavorNotes.map((name) => ({ name, slug: slugify(name) })),
  });
  await prisma.brewMethod.createMany({
    data: brewMethods.map((method) => ({ ...method, slug: slugify(method.name) })),
  });

  console.log('Criando torrefações parceiras...');
  for (const roaster of roasters) {
    await prisma.roaster.create({ data: { ...roaster, slug: slugify(roaster.name) } });
  }

  console.log('Criando cafés do catálogo...');
  for (const { roaster, notes, methods, ...coffee } of coffees) {
    const slug = slugify(coffee.name);

    await prisma.coffee.create({
      data: {
        ...coffee,
        slug,
        storeUrl: `https://exemplo-loja.com.br/produtos/${slug}`,
        imageUrl: `https://placehold.co/600x600/2b1a12/f5e9da?text=${encodeURIComponent(coffee.name)}`,
        roaster: { connect: { slug: slugify(roaster) } },
        flavorNotes: { connect: notes.map((note) => ({ slug: slugify(note) })) },
        brewMethods: { connect: methods.map((method) => ({ slug: slugify(method) })) },
      },
    });
  }

  const [roasterCount, coffeeCount] = await Promise.all([prisma.roaster.count(), prisma.coffee.count()]);
  console.log(`Seed concluído: ${roasterCount} torrefações e ${coffeeCount} cafés.`);
}

main()
  .catch((error) => {
    console.error('Falha no seed:', error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

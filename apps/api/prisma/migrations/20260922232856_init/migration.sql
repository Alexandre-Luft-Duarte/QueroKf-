-- CreateEnum
CREATE TYPE "BeanType" AS ENUM ('ARABICA', 'ROBUSTA', 'BLEND');

-- CreateEnum
CREATE TYPE "RoastLevel" AS ENUM ('CLARA', 'MEDIA', 'MEDIA_ESCURA', 'ESCURA');

-- CreateEnum
CREATE TYPE "Process" AS ENUM ('NATURAL', 'LAVADO', 'CEREJA_DESCASCADO', 'FERMENTADO', 'HONEY');

-- CreateTable
CREATE TABLE "roasters" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "websiteUrl" TEXT NOT NULL,
    "logoUrl" TEXT,
    "city" TEXT,
    "state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roasters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coffees" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "priceCents" INTEGER NOT NULL,
    "weightGrams" INTEGER NOT NULL,
    "beanType" "BeanType" NOT NULL,
    "roastLevel" "RoastLevel" NOT NULL,
    "process" "Process" NOT NULL DEFAULT 'NATURAL',
    "origin" TEXT NOT NULL,
    "region" TEXT,
    "altitude" INTEGER,
    "scaScore" INTEGER,
    "storeUrl" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "roasterId" TEXT NOT NULL,

    CONSTRAINT "coffees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flavor_notes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flavor_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brew_methods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brew_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CoffeeFlavorNotes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CoffeeFlavorNotes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CoffeeBrewMethods" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CoffeeBrewMethods_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "roasters_name_key" ON "roasters"("name");

-- CreateIndex
CREATE UNIQUE INDEX "roasters_slug_key" ON "roasters"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "coffees_slug_key" ON "coffees"("slug");

-- CreateIndex
CREATE INDEX "coffees_roasterId_idx" ON "coffees"("roasterId");

-- CreateIndex
CREATE INDEX "coffees_beanType_roastLevel_idx" ON "coffees"("beanType", "roastLevel");

-- CreateIndex
CREATE UNIQUE INDEX "flavor_notes_name_key" ON "flavor_notes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "flavor_notes_slug_key" ON "flavor_notes"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "brew_methods_name_key" ON "brew_methods"("name");

-- CreateIndex
CREATE UNIQUE INDEX "brew_methods_slug_key" ON "brew_methods"("slug");

-- CreateIndex
CREATE INDEX "_CoffeeFlavorNotes_B_index" ON "_CoffeeFlavorNotes"("B");

-- CreateIndex
CREATE INDEX "_CoffeeBrewMethods_B_index" ON "_CoffeeBrewMethods"("B");

-- AddForeignKey
ALTER TABLE "coffees" ADD CONSTRAINT "coffees_roasterId_fkey" FOREIGN KEY ("roasterId") REFERENCES "roasters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoffeeFlavorNotes" ADD CONSTRAINT "_CoffeeFlavorNotes_A_fkey" FOREIGN KEY ("A") REFERENCES "coffees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoffeeFlavorNotes" ADD CONSTRAINT "_CoffeeFlavorNotes_B_fkey" FOREIGN KEY ("B") REFERENCES "flavor_notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoffeeBrewMethods" ADD CONSTRAINT "_CoffeeBrewMethods_A_fkey" FOREIGN KEY ("A") REFERENCES "brew_methods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoffeeBrewMethods" ADD CONSTRAINT "_CoffeeBrewMethods_B_fkey" FOREIGN KEY ("B") REFERENCES "coffees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function main() {
    // Categorías por defecto que se crearán para cada nueva tienda
    /* const defaultCategories = [
        {
            name: 'General',
            description: 'Productos generales de la tienda',
            slug: 'general',
            sort_order: 1
        },
        {
            name: 'Destacados',
            description: 'Productos destacados y promociones',
            slug: 'destacados',
            sort_order: 2
        },
        {
            name: 'Novedades',
            description: 'Productos nuevos y recientes',
            slug: 'novedades',
            sort_order: 3
        },
        {
            name: 'Ofertas',
            description: 'Productos en oferta y descuentos',
            slug: 'ofertas',
            sort_order: 4
        },
        {
            name: 'Más Vendidos',
            description: 'Productos más populares',
            slug: 'mas-vendidos',
            sort_order: 5
        }
    ]; */

    // Crear categorías por defecto del sistema
   /*  for (const category of defaultCategories) {
        await prisma.category.upsert({
            where: { 
                slug: category.slug,
                store_id: 39,
                
             },
            update: category,
            create: category
        });
    } */

    console.log('✅ Categorías por defecto creadas exitosamente');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
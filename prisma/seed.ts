import { PrismaClient } from './generated/prisma'; // Ajusta el path si tu output es diferente

const prisma = new PrismaClient();

async function main() {
    const categories = [
        'Electrónica',
        'Ropa',
        'Hogar',
        'Juguetes',
        'Deportes',
        'Libros',
        'Música',
        'Videojuegos',
        'Salud',
        'Belleza',
        'Automotriz',
        'Jardinería',
        'Mascotas',
        'Oficina',
        'Herramientas',
        'Bebés',
        'Alimentos',
        'Bebidas',
        'Arte',
        'Viajes',
        'Golosinas',
        'Otros'
    ];

    for (const name of categories) {
        await prisma.category.create({
            data: {
                name,
                slug: name.toLowerCase().replace(/ /g, '-'),
            }
        })
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
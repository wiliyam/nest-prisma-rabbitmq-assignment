// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
	// create a book
	const book = await prisma.book.upsert({
		where: { id: 1 },
		update: {},
		create: {
			id: 1,
			title: 'Slow Horses',
			writer: 'Mick Herron',
			coverImage:
				'https://images-na.ssl-images-amazon.com/images/I/51Ga5GuElyL._AC_SX184_.jpg',
			price: 10.99,
			tag: ['fiction', 'thriller'],
		},
	});
	console.log('book created: ', book);

	// create a customer
	const customer = await prisma.customer.upsert({
		where: { id: 1 },
		update: {},
		create: {
			id: 1,
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: 'password',
			token: btoa('johndoe@example.com:password'),
		},
	});

	console.log('customer created: ', customer);
}

// execute the main function
main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		// close Prisma Client at the end
		await prisma.$disconnect();
	});

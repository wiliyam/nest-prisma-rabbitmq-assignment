import { Book } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class BookEntity implements Book {
	@ApiProperty()
	id: number;

	@ApiProperty()
	title: string;

	@ApiProperty()
	writer: string;

	@ApiProperty()
	coverImage: string;

	@ApiProperty()
	price: number;

	@ApiProperty()
	tag: string[];

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}

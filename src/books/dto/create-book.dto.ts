import { ApiProperty } from '@nestjs/swagger';
export class CreateBookDto {
	@ApiProperty({ required: true })
	title: string;

	@ApiProperty({ required: true })
	writer: string;

	@ApiProperty({ required: false, default: '' })
	coverImage: string;

	@ApiProperty({ required: true })
	price: number;

	@ApiProperty({ required: false, default: [] })
	tag: string[];
}

import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
	@ApiProperty({ required: true })
	name: string;

	@ApiProperty({ required: true })
	email: string;

	@ApiProperty({ required: true })
	password: string;
}

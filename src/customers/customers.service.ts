import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { LoginCustomerDta } from './dto/login-customer.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CustomersService {
	constructor(private prisma: PrismaService) {}

	register(createCustomerDto: CreateCustomerDto) {
		// return 'This action adds a new customer';
		let token = btoa(
			`${createCustomerDto.email}:${createCustomerDto.password}`,
		);
		return this.prisma.customer.create({
			data: {
				name: createCustomerDto.name,
				email: createCustomerDto.email,
				password: createCustomerDto.password,
				token: token,
			},
		});
	}

	async login(loginCustomerDto: LoginCustomerDta) {
		const customer = await this.prisma.customer.findUnique({
			where: { email: loginCustomerDto.email },
		});
		if (customer && customer.password === loginCustomerDto.password) {
			return {
				token: customer.token,
			};
		}
		return null;
	}

	async verify(token: string) {
		const customer = await this.prisma.customer.findFirst({
			where: { token },
		});
		return customer == null ? false : customer.id;
	}
}

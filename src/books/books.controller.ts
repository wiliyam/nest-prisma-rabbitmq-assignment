import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiTags, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { BookEntity } from './entities/book.entity';

@Controller('books')
@ApiTags('books')
export class BooksController {
	constructor(private readonly booksService: BooksService) {}

	@Post()
	@ApiCreatedResponse({ type: BookEntity })
	create(@Body() createBookDto: CreateBookDto) {
		return this.booksService.create(createBookDto);
	}

	@Get()
	@ApiOkResponse({ type: [BookEntity] })
	findAll() {
		return this.booksService.findAll();
	}

	@Get(':id')
	@ApiOkResponse({ type: BookEntity })
	findOne(@Param('id') id: string) {
		return this.booksService.findOne(+id);
	}

	@Patch(':id')
	@ApiOkResponse({ type: BookEntity })
	update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
		return this.booksService.update(+id, updateBookDto);
	}

	@Delete(':id')
	@ApiOkResponse({ type: BookEntity })
	remove(@Param('id') id: string) {
		return this.booksService.remove(+id);
	}
}

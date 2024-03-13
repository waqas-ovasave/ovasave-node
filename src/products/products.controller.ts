import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { RoleGuard } from 'src/auth/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/auth/interfaces/user.interface';
import { Roles } from 'src/auth/roles.decorator';
import { multerOptions } from 'src/file-upload/multer.config';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('add-product')
  // we sue middle value as max limit of files
  @UseInterceptors(FilesInterceptor('files', 5, multerOptions))
  addProduct(
    @Body() createProduct,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productsService.createProduct(createProduct, files);
  }

  @Get('all-products')
  allProducts() {
    return this.productsService.findAllProducts();
  }

  @Get(':id')
  singleProduct(@Param('id') id: number) {
    return this.productsService.findOneProduct(id);
  }

  @Patch(':id')
  updateProduct(@Param('id') id: number, @Body() updateProduct) {
    return this.productsService.updateSingleProduct(id, updateProduct);
  }

  @Delete(':id')
  removeProduct(@Param('id') id: number) {
    return this.productsService.removeSingleProduct(id);
  }
}

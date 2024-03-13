import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { BaseService } from 'src/baseservice/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorHandlingService } from 'src/error-handling/error-handling.service';

@Injectable()
export class ProductsService extends BaseService<Product> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    protected readonly errorHandlingService: ErrorHandlingService,
  ) {
    super(productRepository, errorHandlingService); // Calling the super constructor with the injected repository
  }
  async createProduct(createProduct, files) {
    // Map the array of file objects to an array of image URLs
    const imageUrls = files.map((file) => file.path);
    // Assign the array of image URLs to the images property of createProduct
    createProduct.images = imageUrls;
    const result = await super.create(createProduct);
    return result;
  }

  async findAllProducts() {
    const result = await super.findAll();
    return result;
  }

  async findOneProduct(id: number) {
    const result = await super.findSingle({ id: id });
    return result;
  }

  async updateSingleProduct(id: number, updateProduct) {
    const result = await super.update(id, updateProduct);
    return result;
  }

  async removeSingleProduct(id: number) {
    const result = await super.delete(id);
    return result;
  }
}

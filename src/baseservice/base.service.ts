import { Injectable, HttpStatus } from '@nestjs/common';
import { ErrorHandlingService } from 'src/error-handling/error-handling.service';
import {
  Repository,
  DeepPartial,
  DeleteResult,
  FindOptionsWhere,
  Entity,
} from 'typeorm';

@Injectable()
export class BaseService<T> {
  constructor(
    protected readonly repository: Repository<T>,
    protected readonly errorHandlingService: ErrorHandlingService,
  ) {}

  // interface to send response
  private wrapResponse(
    data: any,
    statusCode: HttpStatus,
    message: string,
    success: boolean,
  ): any {
    return { data, status: statusCode, message, success };
  }

  // find all
  async findAll(): Promise<T[] | any> {
    try {
      const response = await this.repository.find();

      // If no record found, return custom error response
      if (!response.length) {
        return this.errorHandlingService.handle({
          message: 'No record found.',
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
        });
      }

      return this.wrapResponse(response, HttpStatus.OK, 'data found', true);
    } catch (error) {
      return this.errorHandlingService.handle({
        message: 'An error occurred while retrieving data.',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
      });
    }
  }

  // find single record
  async findSingle(searchQuery: Partial<T>) {
    try {
      const response = await this.repository.findOne({
        where: searchQuery as FindOptionsWhere<typeof Entity>,
      });

      // If no record found, return custom error response
      if (!response) {
        return this.errorHandlingService.handle({
          message: `No record found with provided criteria.`,
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
        });
      }

      return this.wrapResponse(response, HttpStatus.OK, 'data found', true);
    } catch (error) {
      return this.errorHandlingService.handle({
        message: error.message,
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
      });
    }
  }
  // to post data
  async create(createDto: DeepPartial<T>) {
    try {
      const newEntity = this.repository.create(createDto);
      const createdEntity = await this.repository.save(newEntity);
      return this.wrapResponse(
        createdEntity,
        HttpStatus.CREATED,
        'data found',
        true,
      );
    } catch (error) {
      return this.errorHandlingService.handle({
        message: 'An error occurred while creating data.',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
      });
    }
  }

  // to update data
  async update(id: number, updateDto: DeepPartial<T>) {
    try {
      const existingEntity = await this.repository.findOne({
        where: { id: id } as FindOptionsWhere<typeof Entity>,
      });
      // If no existing entity found, return custom error response
      if (!existingEntity) {
        return this.errorHandlingService.handle({
          message: `No record found with ID ${id} to update.`,
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
        });
      }
      Object.assign(existingEntity, updateDto);
      const updatedEntity = await this.repository.save(existingEntity);
      return this.wrapResponse(
        updatedEntity,
        HttpStatus.OK,
        'data found',
        true,
      );
    } catch (error) {
      return this.errorHandlingService.handle({
        message: 'An error occurred while updating data.',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
      });
    }
  }

  // to delete data
  async delete(id: number): Promise<DeleteResult | any> {
    try {
      // Attempt to delete the item
      const response = await this.repository.delete(id);

      // If no item was deleted (no rows affected), return custom error response
      if (response.affected === 0) {
        return this.errorHandlingService.handle({
          message: `No record found with ID ${id} to delete.`,
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
        });
      }

      // Return the delete result
      return this.wrapResponse(response, HttpStatus.OK, 'data found', true);
    } catch (error) {
      return this.errorHandlingService.handle({
        message: 'An error occurred while deleting data.',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
      });
    }
  }
}

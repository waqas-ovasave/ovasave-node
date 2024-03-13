// product.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'NAME', unique: true })
  name: string;

  @Column({ name: 'DESCRIPTION', type: 'text' })
  description: string;

  //   @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Column({ name: 'PRICE', type: 'decimal' })
  price: number;

  @Column({ name: 'CURRENCY' })
  currency: string;

  @Column({ name: 'IMAGES', type: 'json', nullable: true })
  images: string[]; // Array to store image URLs

  @CreateDateColumn({
    name: 'CREATED_AT',
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'UPDATED_AT',
    type: 'timestamp',
  })
  updatedAt: Date;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Orders {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'PRODUCT_ID' })
  productId: string;

  @Column({ name: 'PRODUCT_NAME' })
  productName: string;

  @Column({ name: 'QUANTITY' })
  quantity: number;

  @Column({ name: 'AMOUNT' })
  amount: number;

  @Column({ name: 'CURRRENCY' })
  currency: string;

  @Column({ name: 'PAYMENT_METHOD' })
  paymentMethod: string;

  @Column({ name: 'STATUS' })
  status: string;

  @Column({ name: 'PAYMENT_INTENT_ID' })
  paymentIntentId: string;

  @Column({ name: 'CUSTOMERDETAILS' }) // Use JSON type to store JSON data
  customerDetails: string;

  @Column({ name: 'CREATED_BY', nullable: true }) // Nullable if createdBy can be optional
  createdBy: number;

  @Column({ name: 'UPDATED_BY', nullable: true }) // Nullable if updatedBy can be optional
  updatedBy: number;

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

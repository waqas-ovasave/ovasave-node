// contact.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ContactUs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'NAME' })
  name: string;

  @Column({ name: 'EMAIL' })
  email: string;

  @Column({ name: 'DESCRIPTION' })
  description: string;

  @Column({ name: 'IPADDRESS' })
  ipAddress: string;

  @Column({ name: 'BROWSER' })
  browser: string;

  @Column({ name: 'LOCATION', nullable: true })
  location: string;

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

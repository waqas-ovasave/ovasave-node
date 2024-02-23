import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  toJSON() {
    const { password, ...userWithoutPassword } = this; // Extract password field and create a new object without it
    return userWithoutPassword; // Return the new object
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'FIRST_NAME' })
  firstName: string;

  @Column({ name: 'LAST_NAME' })
  lastName: string;

  @Column({ name: 'DATE_OF_BIRTH', nullable: true })
  dateOfBirth: Date;

  @Column({ name: 'EMAIL', unique: true })
  email: string;

  @Column({ name: 'PASSWORD' })
  password: string;

  @Column({ name: 'PHONE_NUMBER', nullable: true })
  phoneNumber: string;

  @Column({ name: 'OTP', nullable: true })
  otp: string | null;

  @Column({
    name: 'OTP_EXPIRATION',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  otpExpiration: Date | null;

  @Column({ name: 'IS_VERIFIED', default: false })
  IsVerified: boolean;

  @Column({ name: 'RESET_TOKEN', nullable: true })
  resetToken: string | null;

  @Column({ name: 'ROLE', default: 'user' }) // Set default value for role
  role: string;

  @Column({ name: 'PROFILE', nullable: true }) // Field to store the image path
  profile: string | null;

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

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { AuthenticateDto } from './dto/authenticate.dto';
import { IAuthenticate } from './interfaces/user.interface';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async authenticate(authenticateDto: AuthenticateDto): Promise<IAuthenticate> {
    const { email, password } = authenticateDto;

    // Find the user by email
    const user = await this.userRepository.findOne({ where: { email } });

    // Check if user exists
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }

    // Check if user is verified
    if (!user.IsVerified) {
      throw new UnauthorizedException('User is not verified');
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await compare(password, user.password);

    if (passwordMatch) {
      // If password matches, generate token
      const token = sign({ ...user }, process.env.JWT_SECRET);
      return { user, token };
    } else {
      // If password doesn't match, throw NotFoundException
      throw new NotFoundException('Invalid credentials');
    }
  }
}

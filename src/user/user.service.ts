import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/baseservice/base.service';
import { ErrorHandlingService } from 'src/error-handling/error-handling.service';
import { PaginationService } from 'src/pagination/pagination.service';
import { hash } from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import { generateResetToken } from 'src/helper-functions/helper-functions';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    protected readonly errorHandlingService: ErrorHandlingService,
    protected readonly paginationService: PaginationService,
    protected readonly emailService: EmailService,
  ) {
    super(userRepository, errorHandlingService); // Calling the super constructor with the injected repository
  }

  async registerUser(userData) {
    userData.password = await hash(userData.password, 10);
    const result = await super.create(userData);
    return result;
  }

  async findAllData(queryParams) {
    const result = await super.findAll();
    const newResult = this.paginationService.paginate(result, queryParams);
    return newResult;
  }

  async findOneData(id: number) {
    const result = await super.findSingle({ id: id });
    return result;
  }

  async updateOneData(id: number, updateUser) {
    const result = await super.update(id, updateUser);
    return result;
  }

  async removeOneData(id: number) {
    const result = await super.delete(id);
    return result;
  }

  // Reset the user's password ste:1
  async requestPasswordReset(email: string) {
    const user = await super.findSingle({ email: email });
    // If user is found, generate reset token and update the user entity

    if (user) {
      const resetToken = generateResetToken();
      const id = user.data.id;
      const email = user.data.email;

      // Update the user entity with the reset token
      const updatedUser = await super.update(id, { resetToken });

      // If user entity was successfully updated, send the reset password email
      if (updatedUser) {
        const resetEmailSubject = 'Reset Your Password';
        // const resetEmailHtml = `<p>Dear ${user.data.email},</p><p>Your password reset token is: ${resetToken}</p>`;
        const resetEmailHtml = `<p>Dear ${user.data.email},</p><p>Your Verification Link For [AppName] is <br/><span style="color:green"><b/>
        <a href="https://github.com/"> ${resetToken}</p></a>
        </b></span></p>this Link will be <span style="color:red"><b>expire after 1 hour</b></span>`;
        await this.emailService.sendEmail(
          email,
          resetEmailSubject,
          resetEmailHtml,
        );
      }

      return updatedUser;
    }
    // If user is not found, return null or throw an error
    return null; // or throw new Error('User not found');
  }

  // Reset the user's password ste:2
  async resetPassword(resetToken: string, password: string) {
    try {
      // Verify the reset token and check its expiration
      const user = await super.findSingle({
        resetToken,
        // expireToken: { $gt: new Date() },
      });
      const id = user.data.id;
      const newPassword = await hash(password, 10);

      if (!user) {
        throw new UnauthorizedException('Invalid or expired reset token');
      }

      const result = await super.update(id, { password: newPassword });
      if (result) {
        // subject and html tags to send in email to user
        const subject = 'Password Reset Successful';
        const htmlContent = `<p>Your  <span style="color:red"> password </span>has been changed against this email : <span style="color:red">${user.data.email} </span></p>`;

        // Send an email to the user
        const emailSent = await this.emailService.sendEmail(
          user?.data?.email,
          subject,
          htmlContent,
        );
        if (emailSent) {
          // Return a success message
          return {
            status: 200,
            message: 'Password reset successful',
            success: true,
          };
        }
      }
    } catch (error) {
      // Handle any unexpected errors
      throw new InternalServerErrorException('Password reset failed');
    }
  }

  async updateWithMedia(
    id: number,
    updateUser,
    file: Express.Multer.File,
  ): Promise<any> {
    // Access the file path from the file object
    const filePath = file.path;
    // Update the UpdateUserDto with the file path
    updateUser.profile = filePath;
    // Call the update method in user service to update the data
    const result = await super.update(id, updateUser);
    return result; // Return the updated result
  }
}

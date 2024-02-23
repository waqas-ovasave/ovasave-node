import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/file-upload/multer.config';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/interfaces/user.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // post, sign-up without verify from otp
  @Post('sign-up')
  signUp(@Body() userData) {
    return this.userService.registerUser(userData);
  }

  @Post('verify-otp') // verify otp to complete the sign-up process
  verifyOTP(@Body() OTP) {
    return this.userService.verificationOTP(OTP);
  }

  //get all records
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('all-users')
  findAll(@Query() queryParams) {
    return this.userService.findAllData(queryParams);
  }

  //get single record
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOneData(id);
  }

  // update the data without multi-media
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateData(@Param('id') id: number, @Body() updateUser) {
    return this.userService.updateOneData(id, updateUser);
  }

  // update data with multi-media, so it shoul dbe in formData from front-end
  @UseGuards(JwtAuthGuard)
  @Patch('/update-dp/:id')
  @UseInterceptors(FileInterceptor('file', multerOptions)) // Intercept file upload
  updateDataWithMedia(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File, // The uploaded file
    @Body() updateUser,
  ) {
    const result = this.userService.updateWithMedia(id, updateUser, file);
    return result;
  }

  // delete a record
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  removeOne(@Param('id') id: number) {
    return this.userService.removeOneData(+id);
  }

  // step 1: Request password reset
  @UseGuards(JwtAuthGuard)
  @Post('password-reset')
  async requestPasswordReset(@Body() body) {
    const email = body.email;
    return await this.userService.requestPasswordReset(email);
  }

  // Step 2: Reset password with token
  @UseGuards(JwtAuthGuard)
  @Post('password-reset/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body('password') password: string,
  ) {
    const result = await this.userService.resetPassword(token, password);
    return result;
  }
}

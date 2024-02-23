/* eslint-disable prettier/prettier */
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorHandlingService } from 'src/error-handling/error-handling.service';
const errorService = new ErrorHandlingService();

// Define the base upload path
const uploadBasePath = './uploads/';

// Ensure the base upload directory exists
if (!existsSync(uploadBasePath)) {
  mkdirSync(uploadBasePath);
}

// Multer storage configuration
export const multerStorageConfig = diskStorage({
  // Destination storage path details
  destination: (req: any, file: any, cb: any) => {
    let uploadPath = uploadBasePath;

    // Check file extension and update upload path accordingly
    const ext = extname(file.originalname).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif') {
      uploadPath += 'images/';
    } else if (ext === '.pdf') {
      uploadPath += 'pdf/';
    } else {
      // Reject unsupported file types
      return cb(
        new HttpException(
          errorService.handle({
            message: `Unsupported file type ${extname(file.originalname)}`,
            statusCode: HttpStatus.BAD_REQUEST,
            success: false,
          }),
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }

    // Ensure the specific upload directory exists
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }

    // Pass the determined upload path to multer
    cb(null, uploadPath);
  },
  // File modification details
  filename: (req: any, file: any, cb: any) => {
    // Generate a unique filename using UUID and original file extension
    const uniqueFilename = `${uuid()}${extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

// Multer upload options
export const multerOptions = {
  // Enable file size limits
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB
  },
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
    if (
      file.mimetype.match(/^image\/(jpg|jpeg|png|gif)$/) ||
      file.mimetype === 'application/pdf'
    ) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(
        new HttpException(
          errorService.handle({
            message: `Unsupported file type ${extname(file.originalname)}`,
            statusCode: HttpStatus.BAD_REQUEST,
            success: false,
          }),
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  // Use the configured storage
  storage: multerStorageConfig,
};

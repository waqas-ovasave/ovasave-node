import { Injectable, HttpStatus } from '@nestjs/common';

@Injectable()
export class ErrorHandlingService {
  handle({
    message,
    data,
    statusCode,
    success,
  }: {
    message: string;
    data?: any;
    statusCode?: HttpStatus;
    success: boolean;
  }): any {
    // Log the error message
    console.error('An error occurred:', message);

    // Create the response object
    const response: any = { message, success };

    // Add data to the response if provided
    if (data) {
      response.data = data;
    }

    // Set status code using switch case
    switch (statusCode) {
      case HttpStatus.BAD_REQUEST:
        response.statusCode = HttpStatus.BAD_REQUEST;
        break;
      case HttpStatus.UNAUTHORIZED:
        response.statusCode = HttpStatus.UNAUTHORIZED;
        break;
      case HttpStatus.FORBIDDEN:
        response.statusCode = HttpStatus.FORBIDDEN;
        break;
      case HttpStatus.NOT_FOUND:
        response.statusCode = HttpStatus.NOT_FOUND;
        break;
      case HttpStatus.CONFLICT:
        response.statusCode = HttpStatus.CONFLICT;
        break;
      // Add more cases as needed for other status codes
      default:
        response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    // Return the response
    return response;
  }
}

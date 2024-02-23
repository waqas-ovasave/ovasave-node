// config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// to add env variables dynamically
const envFilePath =
  process.env.NODE_ENV === 'production'
    ? '.production.env'
    : process.env.NODE_ENV === 'staging'
    ? '.staging.env'
    : '.development.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
    }),
  ],
})
export class ConfigModuleENV {}

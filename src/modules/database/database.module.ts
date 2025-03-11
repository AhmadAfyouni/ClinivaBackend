import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Ensures .env variables are available globally
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const mongoUri = configService.get<string>('MONGO_URI');

        if (!mongoUri) {
          throw new Error('MONGO_URI is missing in environment variables! ❌');
        }

        console.log(` Connecting to MongoDB at: ${mongoUri} ✅`);
        return { uri: mongoUri };
      },
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}

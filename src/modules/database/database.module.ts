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
        const dbName = configService.get<string>('DB_NAME', 'db');

        if (!mongoUri) {
          throw new Error('MONGO_URI is missing in environment variables!');
        }

        console.log(`Connecting to MongoDB at: ${mongoUri}`);
        console.log(`Using database: ${dbName}`);

        // Handling connection errors and logging details
        try {
          const mongoose = require('mongoose');
          mongoose.connect(mongoUri, { dbName })
            .then(() => {
              console.log('Successfully connected to MongoDB');
            })
            .catch((error) => {
              console.error('Error connecting to MongoDB:', error.message);
              // process.exit(1); // Exit the process if the connection fails
            });
        } catch (error) {
          console.error('An unexpected error occurred while connecting to MongoDB:', error.message);
          // process.exit(1); // Exit the process if an unexpected error occurs
        }

        // Return the connection options
        return { uri: mongoUri, dbName };
      },
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {
}

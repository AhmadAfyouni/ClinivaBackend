import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI!), // No need for extra options in Mongoose 6+
  ],
  exports: [MongooseModule], // Exporting MongooseModule for use in other modules
})
export class DatabaseModule {}
import { MongooseModule } from '@nestjs/mongoose';

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    throw new Error('MONGO_URI is not defined in the environment variables!');
}

export const DatabaseConfig = MongooseModule.forRoot(mongoUri);

import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod;

export const setupTestDB = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGO_URI = uri;
  return uri;
};

export const teardownTestDB = async () => {
  if (mongod) {
    await mongod.stop();
  }
};
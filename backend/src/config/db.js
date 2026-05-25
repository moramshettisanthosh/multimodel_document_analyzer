const mongoose = require('mongoose');
let mongoServer;

const connectDB = async () => {
  let uri = process.env.MONGODB_URI;
  if (!uri) {
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.warn('MONGODB_URI not set. Using in-memory MongoDB for local development.');
    } catch (err) {
      console.error('MONGODB_URI not set and in-memory MongoDB could not start', err);
      process.exit(1);
    }
  }

  try {
    await mongoose.connect(uri, { dbName: 'auroradocs' });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error', err);
    process.exit(1);
  }
};

module.exports = connectDB;

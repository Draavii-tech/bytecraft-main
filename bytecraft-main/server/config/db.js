import mongoose from 'mongoose';

// Connection cache across serverless warm/cold invocations
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

let mongoMemoryServer = null;

export const connectDB = async () => {
  // 1. If connection already active, reuse it
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // 2. If a connection promise is already in-flight, await it to prevent race conditions
  if (cached.promise) {
    cached.conn = await cached.promise;
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI;
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

  // Connect to configured MongoDB URI (e.g. MongoDB Atlas)
  if (uri && uri.trim()) {
    try {
      const sanitizedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
      console.log(`Connecting to MongoDB URI: ${sanitizedUri}`);

      const opts = {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        dbName: process.env.DB_NAME || 'bytecraft_blog',
      };

      cached.promise = mongoose.connect(uri.trim(), opts).then((m) => {
        console.log('Successfully connected to MongoDB Atlas / configured URI.');
        return m;
      });

      cached.conn = await cached.promise;
      return cached.conn;
    } catch (err) {
      cached.promise = null;
      console.error(`MongoDB Connection Error: ${err.message}`);

      if (isServerless) {
        throw new Error(
          `Failed to connect to MongoDB Atlas (${err.message}).\n` +
          `Troubleshooting steps for Vercel deployment:\n` +
          `1. Ensure MONGODB_URI is configured in Vercel Project Settings > Environment Variables.\n` +
          `2. In MongoDB Atlas, go to "Network Access" -> "IP Access List" -> add "0.0.0.0/0" (Allow Access from Anywhere).\n` +
          `3. In MongoDB Atlas, verify your database user has Read & Write privileges in "Database Access".\n` +
          `4. If your MongoDB user password contains special characters (@, #, %, etc.), ensure they are URL-encoded.`
        );
      }
      console.warn('Falling back to local / memory database for local development...');
    }
  } else if (isServerless) {
    throw new Error(
      `MONGODB_URI environment variable is missing in Vercel.\n` +
      `Please navigate to your Vercel Project Settings -> Environment Variables and add MONGODB_URI with your MongoDB Atlas connection string.\n` +
      `Format: mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bytecraft_blog?retryWrites=true&w=majority`
    );
  }

  // Local development fallback 1: Check local MongoDB service
  try {
    const localUri = 'mongodb://127.0.0.1:27017/bytecraft_blog';
    console.log(`Checking for local MongoDB service at ${localUri}...`);
    cached.promise = mongoose.connect(localUri, {
      serverSelectionTimeoutMS: 2000,
    });
    cached.conn = await cached.promise;
    console.log(`Connected to local MongoDB service.`);
    return cached.conn;
  } catch (err) {
    console.log(`No active local MongoDB service detected. Starting embedded MongoDB instance...`);
    cached.promise = null;
  }

  // Local development fallback 2: Embedded MongoMemoryServer (dynamically loaded)
  try {
    const { MongoMemoryServer: MemoryServer } = await import('mongodb-memory-server');
    mongoMemoryServer = await MemoryServer.create({
      instance: {
        dbName: 'bytecraft_blog',
      },
    });
    const memoryUri = mongoMemoryServer.getUri();
    cached.promise = mongoose.connect(memoryUri);
    cached.conn = await cached.promise;
    console.log(`Connected to embedded MongoDB Memory Server at: ${memoryUri}`);
    return cached.conn;
  } catch (memErr) {
    cached.promise = null;
    console.error(`Failed to start embedded MongoDB Memory Server:`, memErr);
    throw memErr;
  }
};

export const disconnectDB = async () => {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
  }
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
    mongoMemoryServer = null;
  }
};

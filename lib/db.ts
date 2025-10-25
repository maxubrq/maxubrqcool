import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/post-like';

// Create the connection with production-optimized settings
const connectionString = process.env.DATABASE_URL!;

// Debug logging for production issues
if (process.env.NODE_ENV === 'production') {
  console.log('Database connection string configured:', connectionString ? 'Yes' : 'No');
  console.log('Connection string starts with:', connectionString?.substring(0, 20) + '...');
}

const client = postgres(connectionString, {
  // Connection pool settings for production
  max: 20, // Maximum number of connections
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout in seconds
  // Enable SSL for production
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
});

// Create the database instance
export const db = drizzle(client, { schema });

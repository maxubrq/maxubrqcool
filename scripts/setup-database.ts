import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=');
          process.env[key] = value;
        }
      }
    }
  }
}

// Load environment variables
loadEnvFile();

/**
 * Automated database setup using Drizzle
 * This script uses drizzle-kit push to automatically create the schema
 */

async function setupDatabase() {
  console.log('🚀 Setting up database automatically with Drizzle...');

  const databaseUrl = process.env.DATABASE_URL;
  const supabaseUrl = process.env.SUPABASE_URL;

  if (!databaseUrl && !supabaseUrl) {
    console.log('⚠️  No database credentials found in environment');
    console.log('');
    console.log('📋 Manual Setup Required:');
    console.log('');
    console.log('1. Create a .env.local file with your database credentials:');
    console.log('   DATABASE_URL=postgresql://username:password@host:port/database');
    console.log('   # OR for Supabase:');
    console.log('   SUPABASE_URL=https://your-project.supabase.co');
    console.log('   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
    console.log('');
    console.log('2. Then run: npm run db:migrate');
    console.log('');
    console.log('🔄 Alternative: Manual SQL setup');
    console.log('1. Go to Supabase Dashboard > SQL Editor');
    console.log('2. Copy and paste contents of: sql/01_create_post_like_schema.sql');
    console.log('3. Click "Run"');
    console.log('');
    console.log('📄 SQL file location: sql/01_create_post_like_schema.sql');
    return;
  }

  try {
    console.log('📄 Pushing schema to database...');
    
    // Use drizzle-kit push:pg to create tables automatically
    execSync('npx drizzle-kit push:pg', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });

    console.log('✅ Database schema pushed successfully!');
    console.log('');
    console.log('🔧 Setting up additional functions and policies...');
    
    // Show the remaining SQL that needs to be run manually
    const sqlPath = path.join(__dirname, '../sql/01_create_post_like_schema.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Extract only the functions and RLS policies part
    const functionsAndPolicies = sqlContent.split('-- Create function to safely increment like count')[1];
    
    console.log('📝 Additional setup required:');
    console.log('   The tables were created, but you need to add:');
    console.log('   1. Database functions (increment_post_like, decrement_post_like, get_post_like_count)');
    console.log('   2. RLS policies for security');
    console.log('');
    console.log('🔧 Run this SQL in your database:');
    console.log('─'.repeat(60));
    console.log(functionsAndPolicies);
    console.log('─'.repeat(60));
    console.log('');
    console.log('🎯 Next steps:');
    console.log('   - Run the SQL above in your database');
    console.log('   - Run: npm run db:seed');
    console.log('   - Start your app: npm run dev');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.log('');
    console.log('🔄 Fallback: Manual setup required');
    console.log('1. Go to Supabase Dashboard > SQL Editor');
    console.log('2. Copy and paste contents of: sql/01_create_post_like_schema.sql');
    console.log('3. Click "Run"');
    console.log('');
    console.log('📄 SQL file location: sql/01_create_post_like_schema.sql');
  }
}

// Run if called directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('✅ Setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

export { setupDatabase };

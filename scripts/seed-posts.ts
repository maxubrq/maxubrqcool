import { db } from '../lib/db';
import { postLikeCounters } from '../lib/schema/post-like';

/**
 * Seed script to create demo posts and initialize like counters
 */

async function seedPosts() {
  console.log('🌱 Seeding posts...');

  try {
    // Create demo posts
    const demoPosts = [
      {
        id: '0001_hello-world',
        title: 'Hello World',
      },
      {
        id: '0002_getting-started-with-nextjs',
        title: 'Getting Started with Next.js',
      },
      {
        id: '0003_interactive-components-showcase',
        title: 'Interactive Components Showcase',
      },
      {
        id: '0004_syntax-highlighting-demo',
        title: 'Syntax Highlighting Demo',
      },
      {
        id: '0005_typescript-series-01_introduction',
        title: 'TypeScript Series 01: Introduction',
      },
    ];

    // Note: Posts are assumed to exist in the posts table
    // This script only initializes like counters

    // Initialize like counters for all posts
    for (const post of demoPosts) {
      try {
        await db.insert(postLikeCounters).values({
          postId: post.id,
          likeCount: 0,
          updatedAt: new Date(),
        }).onConflictDoNothing();
        console.log(`✅ Initialized like counter for: ${post.title}`);
      } catch (error) {
        console.log(`⚠️  Like counter already exists for: ${post.title}`);
      }
    }

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedPosts()
    .then(() => {
      console.log('✅ Seed script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed script failed:', error);
      process.exit(1);
    });
}

export { seedPosts };

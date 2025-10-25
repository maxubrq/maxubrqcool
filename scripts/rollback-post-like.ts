import { db } from '../lib/db';
import { postLikeCounters, postLikeEventsDaily } from '../lib/schema/post-like';

/**
 * Rollback script to remove post like system
 * WARNING: This will delete all like data!
 */

async function rollbackPostLike() {
  console.log('🔄 Rolling back post like system...');

  try {
    // Drop functions
    console.log('🗑️  Dropping functions...');
    await db.execute(`
      DROP FUNCTION IF EXISTS public.increment_post_like(uuid);
      DROP FUNCTION IF EXISTS public.decrement_post_like(uuid);
      DROP FUNCTION IF EXISTS public.get_post_like_count(uuid);
    ` as unknown as any);

    // Drop policies
    console.log('🗑️  Dropping policies...');
    await db.execute(`
      DROP POLICY IF EXISTS "Allow public read access to post like counters" ON public.eng_post_like_counters;
      DROP POLICY IF EXISTS "Allow public read access to daily like events" ON public.eng_post_like_events_daily;
    ` as unknown as any);

    // Drop tables
    console.log('🗑️  Dropping tables...');
    await db.execute(`
      DROP TABLE IF EXISTS public.eng_post_like_events_daily;
      DROP TABLE IF EXISTS public.eng_post_like_counters;
    ` as unknown as any);

    console.log('✅ Rollback completed successfully!');
  } catch (error) {
    console.error('❌ Rollback failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  rollbackPostLike()
    .then(() => {
      console.log('✅ Rollback script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Rollback script failed:', error);
      process.exit(1);
    });
}

export { rollbackPostLike };

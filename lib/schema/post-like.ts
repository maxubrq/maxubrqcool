import { pgTable, text, bigint, timestamp, date, primaryKey } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Post like counters table
export var postLikeCounters = pgTable('eng_post_like_counters', {
  postId: text('post_id').primaryKey(),
  likeCount: bigint('like_count', { mode: 'number' }).notNull().default(0),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().default(sql`now()`),
});

// Daily like events table for operational visibility
export var postLikeEventsDaily = pgTable('eng_post_like_events_daily', {
  postId: text('post_id').notNull(),
  day: date('day').notNull(),
  count: bigint('count', { mode: 'number' }).notNull().default(0),
}, (table) => ({
  pk: primaryKey({ columns: [table.postId, table.day] }),
}));

// Types
export type PostLikeCounter = typeof postLikeCounters.$inferSelect;
export type NewPostLikeCounter = typeof postLikeCounters.$inferInsert;
export type PostLikeEventDaily = typeof postLikeEventsDaily.$inferSelect;
export type NewPostLikeEventDaily = typeof postLikeEventsDaily.$inferInsert;

import { relations, sql } from 'drizzle-orm'
import {
  boolean,
  check,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const postStatus = pgEnum('post_status', ['draft', 'published'])

export const topics = pgTable('topics', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 24 }).notNull(),
  handle: varchar('handle', { length: 24 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
})

export const posts = pgTable(
  'posts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    handle: text('handle').unique().notNull(),
    summary: text('summary'),
    htmlContent: text('html_content'),
    jsonContent: text('json_content'),
    topicId: uuid('topic_id').references(() => topics.id),
    totalWords: integer('total_words').default(0),
    status: postStatus('status').default('draft').notNull(),
    featured: boolean('featured').default(false).notNull(),
    enabled: boolean('enabled').default(true).notNull(),
    publishedAt: timestamp('published_at'),
    createdAt: timestamp('created_at').$defaultFn(() => new Date()),
    updatedAt: timestamp('updated_at')
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    check(
      'posts_can_only_be_enabled_when_published',
      sql`${table.enabled} = false OR ${table.status} = 'published'`,
    ),
  ],
)

export const topicsRelations = relations(topics, ({ many }) => ({
  posts: many(posts),
}))

export const postsRelations = relations(posts, ({ one }) => ({
  topic: one(topics, {
    fields: [posts.topicId],
    references: [topics.id],
  }),
}))

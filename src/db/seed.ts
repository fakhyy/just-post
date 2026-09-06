import { config as loadDotenv } from 'dotenv'
import { resolve } from 'node:path'
import { db } from './index'
import { posts, topics } from './schemas/core.schema'

loadDotenv({ path: resolve(process.cwd(), '.env.local') })
loadDotenv({ path: resolve(process.cwd(), '.env') })

const seedTopics = [
  {
    name: 'Rust',
    handle: 'rust',
    description: 'Systems programming with ownership and borrow checking',
  },
  {
    name: 'Careers',
    handle: 'careers',
    description: 'Growth, learning, and the craft of software',
  },
  {
    name: 'TypeScript',
    handle: 'typescript',
    description: 'Type-safe engineering on the web',
  },
]

const seedPosts = [
  {
    title: 'Understand Rust Borrow Checker',
    handle: 'understand-rust-borrow-checker',
    summary:
      'A practical exploration of ownership, moves, borrowing, and why Rust approaches memory differently.',
    htmlContent: '<p>A practical exploration of ownership and borrowing.</p>',
    jsonContent: '{"type":"doc","content":[]}',
    topicId: null,
    totalWords: 1200,
    status: 'published',
    featured: true,
    enabled: true,
    publishedAt: new Date('2024-08-02'),
  },
  {
    title: "The Value of Saying I Don't Know",
    handle: 'the-value-of-saying-i-dont-know',
    summary:
      'What intellectual humility can teach us about learning, certainty, and our understanding of the world.',
    htmlContent: '<p>On intellectual humility.</p>',
    jsonContent: '{"type":"doc","content":[]}',
    topicId: null,
    totalWords: 860,
    status: 'draft',
    featured: false,
    enabled: false,
    publishedAt: null,
  },
  {
    title: 'Designing Trustworthy Type Systems',
    handle: 'designing-trustworthy-type-systems',
    summary:
      'How carefully-scoped types become the documentation your future self appreciates.',
    htmlContent: '<p>Types as living documentation.</p>',
    jsonContent: '{"type":"doc","content":[]}',
    topicId: null,
    totalWords: 1640,
    status: 'published',
    featured: false,
    enabled: true,
    publishedAt: new Date('2025-10-10'),
  },
]

async function seed() {
  const topicRows = await db.insert(topics).values(seedTopics).returning()

  const topicByHandle = Object.fromEntries(
    topicRows.map((topic) => [topic.handle, topic.id]),
  )

  const postsWithTopics = seedPosts.map((post) => ({
    ...post,
    status: post.status as 'draft' | 'published',
    topicId:
      topicByHandle[
        post.handle === 'understand-rust-borrow-checker' ? 'rust' : 'typescript'
      ] ?? null,
  }))

  await db.insert(posts).values(postsWithTopics)

  console.log(
    `Seeded ${topicRows.length} topics and ${postsWithTopics.length} posts`,
  )
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})

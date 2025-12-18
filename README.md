# GraphQL Redis Cache Integration

A Next.js application demonstrating the performance benefits of implementing Redis caching in a GraphQL API with MongoDB as the primary database.

## Overview

This project implements a GraphQL API that showcases the significant performance improvements achieved through Redis caching. The application uses MongoDB for persistent data storage and Redis as an in-memory cache layer to reduce database query latency.

## Tech Stack

- **Frontend**: Next.js 16, React 19, Apollo Client
- **Backend**: Apollo Server, GraphQL
- **Database**: MongoDB (Atlas)
- **Cache**: Redis (Upstash)
- **Styling**: Tailwind CSS

## Architecture

The application follows a layered architecture:

```
Client → Apollo Client → Next.js API Route → Apollo Server → GraphQL Resolvers → Service Layer → Cache/Database
```

### Data Flow

1. **Cache Hit Flow**: GraphQL Query → Redis (Fast) → Response
2. **Cache Miss Flow**: GraphQL Query → Redis (Miss) → MongoDB → Cache Update → Response

## Features

- GraphQL API with queries and mutations
- Redis caching layer with configurable TTL (60 seconds)
- MongoDB integration for persistent storage
- User and Post management
- Real-time performance monitoring
- Cache invalidation on mutations

## Performance Comparison

### Without Redis (Direct MongoDB Query)
- Average response time: **450-700ms**
- Every request hits the database
- Higher database load

### With Redis Cache

#### First Request (Cache Miss)
- Response time: **452.429ms**
- Data fetched from MongoDB
- Result stored in Redis cache

#### Subsequent Requests (Cache Hit)
- Response time: **62.227ms** (86% faster)
- Response time: **44.742ms** (90% faster)
- Response time: **70.318ms** (84% faster)

**Performance Improvement**: Up to **10x faster** response times with Redis caching.

### Key Metrics

| Metric | Without Cache | With Cache (Hit) | Improvement |
|--------|---------------|------------------|-------------|
| Average Response Time | 450-700ms | 45-70ms | 85-90% |
| Database Queries | Every request | Only on miss | 90% reduction |
| Scalability | Limited | High | Significant |

## Installation

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account
- Redis instance (Upstash or local)

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd graphql-redis-graph
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>?retryWrites=true&w=majority
REDIS_URL=rediss://<username>:<password>@<host>:6379
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## GraphQL Schema

### Types

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
}
```

### Queries

```graphql
# Get all users
query {
  users {
    id
    name
    email
  }
}

# Get user by ID (cached)
query {
  user(id: "user_id_here") {
    id
    name
    email
    posts {
      title
      content
    }
  }
}
```

### Mutations

```graphql
# Create a new user
mutation {
  createUser(input: {
    name: "John Doe"
    email: "john@example.com"
  }) {
    id
    name
    email
  }
}

# Create a new post
mutation {
  createPost(input: {
    title: "My Post"
    content: "Post content"
    authorId: "user_id_here"
  }) {
    id
    title
    content
  }
}
```

## Caching Strategy

### Cache Configuration

- **TTL (Time To Live)**: 60 seconds
- **Cache Key Pattern**: `user:{userId}`
- **Invalidation**: Automatic on related mutations

### Implementation Details

The caching layer is implemented in the service layer:

1. **getUserById**: Checks Redis first, falls back to MongoDB on miss
2. **createPost**: Invalidates user cache after post creation
3. **Lazy Connection**: Redis connects only when needed

### Cache Invalidation

Cache is automatically invalidated when:
- A new post is created (user's cache is cleared)
- TTL expires (60 seconds)

## Project Structure

```
graphql-redis-graph/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── graphql/
│   │   │       └── route.js       # Apollo Server integration
│   │   ├── page.js                # Main UI
│   │   └── layout.js              # App layout
│   ├── graphql/
│   │   ├── schema.js              # GraphQL type definitions
│   │   ├── queries.js             # Client-side queries
│   │   └── mutations.js           # Client-side mutations
│   ├── lib/
│   │   ├── mongodb.js             # MongoDB connection
│   │   └── redis.js               # Redis connection
│   ├── models/
│   │   ├── User.js                # User model
│   │   └── Post.js                # Post model
│   └── services/
│       ├── user.service.js        # User business logic
│       └── post.service.js        # Post business logic
├── .env.local                      # Environment variables
└── package.json
```

## Testing the Cache

1. Click "Create User" to create a test user
2. Click "Fetch User" to query the user (cache miss)
3. Check the terminal for "Redis miss for user !" and response time
4. Click "Fetch User" again immediately (cache hit)
5. Observe "Redis hit for user !" with significantly reduced response time

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `REDIS_URL` | Redis connection URL | `rediss://...` or `redis://127.0.0.1:6379` |

## Performance Monitoring

The application includes built-in performance monitoring:

- Response times are logged for each user query
- Cache hit/miss status is displayed in terminal
- Unique timer labels prevent concurrent request conflicts

## Development

### Running Locally

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Best Practices Implemented

1. **Lazy Connection**: Redis and MongoDB connect only when needed
2. **Error Handling**: Graceful fallback on cache failures
3. **Cache Invalidation**: Automatic cache clearing on data mutations
4. **Type Safety**: Consistent data models across layers
5. **Separation of Concerns**: Service layer abstracts database operations

## Known Limitations

- Cache TTL is fixed at 60 seconds
- No cache warming strategy implemented
- Single Redis instance (no clustering)
- Basic cache invalidation (could be more granular)

## Future Enhancements

- Implement cache warming on server startup
- Add configurable TTL per query type
- Implement Redis clustering for high availability
- Add cache statistics dashboard
- Implement more sophisticated cache invalidation strategies
- Add GraphQL subscriptions support

## License

MIT

## Author

Daksh Rohit

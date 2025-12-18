// node type definitions for GraphQL schema

export const typeDefs = `#graphql
# user type node

 type User{
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
}

# post type node

type Post{
    id: ID!
    title: String!
    content: String!
    author: User!
}

# input types for writing mutations - data needed to create users and posts

input CreateUserInput{
    name: String!
    email: String!
}

# input type for creating posts
input CreatePostInput{
    title: String!
    content: String!
    authorId: ID!
}

# query type node -- read-only data operations

type Query{
users: [User!]!
user(id: ID!): User
}


# mutation type node - changeable data operations
type Mutation{
    createUser(input: CreateUserInput!): User!
    createPost(input: CreatePostInput!): Post!
}

`;



import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "@/app/api/graphql/schema";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Post } from "@/models/Post";
import { createUser } from "@/services/user.service";
import { createPost } from "@/services/post.service";
import { getUserById } from "@/services/user.service";

const resolvers={
    Query:{
        users: async()=>{
            await connectDB();
            return User.find();
        },
        
        // user: async(_, {id})=>{
        //     await connectDB();  
        //     return User.findById(id);
        // },

        user: async(_, {id})=>{
            // return await getUserById(id);
            console.time("get user time")
            const result= await getUserById(id);
            console.timeEnd("get user time")
            return result;


        }


    },
    Mutation:{
        createUser: async(_, {input})=>{
            return await createUser(input);
        },
        createPost: async(_, {input})=>{
            return await createPost(input);
        },
            

    User:{
        posts: async(parent)=>{
            await connectDB();
            return Post.find({authorId: parent.id});
        }
    },
    Post:{
        author:async(parent)=>{
            await connectDB();
            return User.findById(parent.authorId);
        }
    }
}
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
}); 

export const handler = startServerAndCreateNextHandler(server);
export {handler as GET, handler as POST};

//EXECUTION FLOW:
// Client → HTTP Request → Apollo Server → GraphQL Schema → Resolver →
// Service → Database → Resolver → GraphQL Schema → Apollo Server → HTTP Response → Client
// Mutation → resolver → service → DB → selected fields returned
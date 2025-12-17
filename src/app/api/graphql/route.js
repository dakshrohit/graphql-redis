import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "@/app/api/graphql/schema";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Post } from "@/models/Post";


const resolvers={
    Query:{
        users: async()=>{
            await connectDB();
            return User.find();
        },
        
        user: async(_, {id})=>{
            await connectDB();  
            return User.findById(id);
        },


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

const server = new ApolloServer({
    typeDefs,
    resolvers,
}); 

export const handler = startServerAndCreateNextHandler(server);
export {handler as GET, handler as POST};
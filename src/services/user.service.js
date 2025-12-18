import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import redis from "@/lib/redis";


//   GraphQL Query → Redis (FAST) → Response
//                 ↓ (if miss)
//               MongoDB → Redis → Response

export async function getUserById(userId) {
    const cacheKey = `user:${userId}`;
    const cachedUser= await redis.get(cacheKey);

    // check cache first for user 
    if(cachedUser){
        console.log("Redis hit for user !");
        return JSON.parse(cachedUser);
    }
    console.log("Redis miss for user !");

    //if not in cache, fetch from DB
    await connectDB();
    const userdata= await User.findById(userId);
    if(!userdata){
        return null;
    }

    // store in cache- ttl=60 secs
    await redis.set(cacheKey, JSON.stringify(userdata), {
    EX: 60,
  });
  return userdata;
}

// redis stored: user info + posts list
// ex : key:   user:123
//      value: { user data + posts }


/* without caching */

// export async function createUser({ name, email }) {
//   await connectDB();

//   const existing = await User.findOne({ email });
//   if (existing) {
//     throw new Error("User already exists");
//   }

//   const user = await User.create({ name, email });
//   return user;
// }

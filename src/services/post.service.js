import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import redis from "@/lib/redis";

export async function createPost({ title, content, authorId }) {
  await connectDB();

  const user = await User.findById(authorId);
  if (!user) {
    throw new Error("User not found");
  }

  const post = await Post.create({
    title,
    content,
    authorId,
  });
  await redis.del(`user:${authorId}`); // invalidate user cache

  return post;
}

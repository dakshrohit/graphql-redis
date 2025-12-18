import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";

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

  return post;
}

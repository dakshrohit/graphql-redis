import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function createUser({ name, email }) {
  await connectDB();

  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error("User already exists");
  }

  const user = await User.create({ name, email });
  return user;
}

import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL ,
});

redis.on("error", (err) => {
  console.log("Redis Client Error", err);
});

let connectPromise;

export const ensureRedis = async () => {
  if (!connectPromise) {
    connectPromise = redis
      .connect()
      .then(() => {
        console.log("Redis connected");
        return redis;
      })
      .catch((err) => {
        connectPromise = null;
        throw err;
      });
  }
  return connectPromise;
};

export default redis;

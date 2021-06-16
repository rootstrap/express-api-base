import { REDIS_PASSWORD, REDIS_HOST } from '@config';
import { createClient, RedisClient } from 'redis';

export const createRedisClient = (): RedisClient => {
  const redisClient = createClient({
    host: REDIS_HOST as string,
    password: REDIS_PASSWORD as string
  });
  redisClient.on('connect', () => {
    console.info(
      `Connected to redis server. Connection id: ${redisClient.connection_id}`
    );
  });
  redisClient.on('error', error => {
    console.error(`Redis error: ${error}`);
  });

  return redisClient;
};

import { redisClient } from '@server';
import { AuthInterface } from '@interfaces';
import { Service } from 'typedi';

@Service()
export class RedisService {
  addTokenToBlacklist(
    input: AuthInterface.ITokenToBlacklistInput
  ): Promise<number> {
    return new Promise((res, rej) => {
      const { email, token } = input;
      return redisClient.sadd(email, token, (err, result) => {
        if (err) {
          rej(err);
        }
        res(result);
      });
    });
  }

  isMemberOfSet(email: string, token: string): Promise<number> {
    console.log(redisClient);
    return new Promise((res, rej) => {
      redisClient.sismember(email, token, (err, result) => {
        if (err) {
          rej(err);
        }
        res(result);
      });
    });
  }
}

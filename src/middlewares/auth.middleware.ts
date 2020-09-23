import { Action } from 'routing-controllers';
import { verifyJWT } from '@services/jwt.service';

const authorizationChecker = async (action: Action): Promise<boolean> => {
  const token = action.request.headers['authorization'];
  if (!token) return false;

  try {
    const payload = await verifyJWT(token);
    return payload !== null;
  } catch (error) {
    return false;
  }
};

export default authorizationChecker;

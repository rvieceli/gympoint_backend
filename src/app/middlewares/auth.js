import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (request, response, next) => {
  const { authorization } = request.headers;

  if (!authorization) {
    return response.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authorization.split(' ');

  try {
    const { id } = await promisify(jwt.verify)(token, authConfig.secret);

    request.userId = id;

    return next();
  } catch (err) {
    return response.status(401).json({ error: 'Invalid token' });
  }
};

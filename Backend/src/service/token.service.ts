import jwt from 'jsonwebtoken';
import config from 'config';

class TokenService {
  constructor() {}

  generateAccessToken(user: any) {
    const jwtKey = config.get('JWT_ACCESS_SECRET') as string;
    const tokenLifetime = config.get('JWT_ACCESS_EXPIRY') as string;

    const token = jwt.sign(
      {
        _id: user._id,
        role: user.type,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        img_path: user.img_path,
        blocked: user.blocked
      },
      jwtKey,
      {
        algorithm: 'HS256',
        expiresIn: tokenLifetime,
      }
    );

    return token;
  }
  generateRefreshToken(user: any) {
    const jwtKey = config.get('JWT_REFRESH_SECRET') as string;
    const tokenLifetime = config.get('JWT_REFRESH_EXPIRY') as string;

    const token = jwt.sign(
      {
        _id: user._id,
        role: user.type,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        img_path: user.img_path,
        blocked: user.blocked
      },
      jwtKey,
      {
        algorithm: 'HS256',
        expiresIn: tokenLifetime,
      }
    );

    return token;
  }
}

export default TokenService;

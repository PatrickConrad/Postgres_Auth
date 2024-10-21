//app/middleware/verifyAuth.js
import {Request, Response, NextFunction} from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import {
  errorMessage, status,
} from '../helpers/status';
import { AuthRequest } from '../types';


dotenv.config();



const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const curHeaders = req.headers;
  const token = curHeaders['token']
  if (token==null||token==='') {
    errorMessage.message = 'Token not provided';
    return res.status(status.bad).send(errorMessage);
  }
  try {
    const decoded =  jwt.verify(`${token}`, process.env.SECRET as string) as JwtPayload;
    req.user = {
      email: decoded['email'],
      user_id: decoded['user_id'],
      is_admin: decoded['is_admin'],
      first_name: decoded['first_name'],
      last_name: decoded['last_name'],
    };
    next();
  } 
  catch (error) {
    errorMessage.message = 'Authentication Failed';
    return res.status(status.unauthorized).send(errorMessage);
  }
};

export default verifyToken;
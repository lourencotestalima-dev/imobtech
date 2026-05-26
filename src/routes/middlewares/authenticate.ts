import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { IGenericRepository } from '../../repositories/interfaces/generic';
import { NextFunction, Request, Response } from 'express';
import constants from '../../utils/constants';
import { UserEntity } from '../../entities/user';
import jwt from 'jsonwebtoken';
import { ICustomRequest } from '../../models/request';

@Service()
export class Authenticate implements ExpressMiddlewareInterface {
  constructor(
    private readonly userRepository: IGenericRepository,
  ){}

  async use(req: ICustomRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization && req.headers.authorization.split('Bearer ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    try {
      const secretKey = constants.jwt.privateKey;

      if (!secretKey) {
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      const validToken: any = jwt.verify(token, secretKey);

      const user = await this.userRepository.selectOneByWhere(UserEntity, { id: validToken.userId });

      if (!user) {
        return res.status(401).json({ message: 'Não autenticado' });
      }

      req.session = {
        userId: user.id,
        sessionId: validToken.sessionId,
        email: validToken.email
      };

      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Não autenticado' });
    }
  }
}
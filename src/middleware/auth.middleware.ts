import createHttpError from 'http-errors';
import { decodeToken } from '../utils/jwt.ulti';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export const isAuth = (rolesRequire = ["user", "admin"]) =>
    (req:Request, res:Response, next:NextFunction) => {
        try {
            const authHeader = req.get('Authorization');
            if (!authHeader) {
                throw createHttpError("Unauthorized");
            }
            const token = authHeader.split(' ')[1];
            const payload = decodeToken(token) as JwtPayload||null
            if (!payload) {
                throw createHttpError(401, "Unauthorized");
            }
            if (!(payload.role == "admin" || rolesRequire.includes(payload.role))){
                throw createHttpError(403, "No Permission");
            }
            (req as any).user = payload;
            return next();
        } catch (error) {
            return next(error);
        }
    };
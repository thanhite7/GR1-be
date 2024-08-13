import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const getDecodedData = (payload:any) => {
    return {
        id: payload._id,
        name: payload.name,
        role: payload.role,
        email: payload.email,
        provider: payload.provider,
        phone_number: payload.phone_number,
        address: payload.address,
    }
}


export const generateAccessToken = (payload:any) => {
    return jwt.sign(getDecodedData(payload), process.env.JWT_SECRET || 'secret');
};

export const decodeToken = (token:any) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        console.log(decoded);
        return decoded;
    } catch (err) {
        return null;
    }
};

export default {generateAccessToken, decodeToken}
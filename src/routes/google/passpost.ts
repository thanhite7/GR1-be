import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Request, Response, Router } from 'express';
import User from '../../model/user.model';
import jwt from 'jsonwebtoken';
import { generateAccessToken } from '../../utils/jwt.ulti';
dotenv.config();

const gg_router = Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
        const user = await User.findOne({googleId: profile.id});
        if(!user){
            await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password:"google",
                role: "user",
                provider:"google",
                googleId:profile.id

            })
        }
        return done(null, accessToken);

    }
  )
);

passport.serializeUser((user, done) => {
    done(null, user);
  });

passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

gg_router.post(
  '/',
  async (req:Request, res:Response) => {
    const data = (jwt.decode(req.body.credentials)) as  any;
    const existEmail = await User.findOne({email:data.email})
    if(!existEmail){
        await User.create({
            name: data.name,
            email: data.email,
            password:"google",
            role: "user",
            provider:"google",
            googleId:data.sub
        })
    }
    const jwt_token = generateAccessToken({id:data.sub,name:data.name,email:data.email,role:"user"});
    res.status(200).json({message:"Ok",jwt_token});
  }
);


gg_router.get('/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {

  res.redirect('/');
});

export default gg_router;
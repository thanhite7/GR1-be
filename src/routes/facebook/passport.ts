import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../../model/user.model';
import dotenv from 'dotenv';
import { Router } from 'express';
import { generateAccessToken } from '../../utils/jwt.ulti';
const fb_router = Router();
dotenv.config();

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });
  
    passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret:process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback"
    },
    async function(accessToken, refreshToken, profile, done) {
      console.log(profile);
      const user = await User.findOne({facebookId: profile.id});
        if(!user){
            await User.create({
                name: profile.displayName,
                email: "facebook",
                password:"facebook",
                role: "user",
                provider:"facebook",
                facebookId:profile.id

            })
        }
        return done(null, accessToken);
    }
  ));
  


fb_router.get('/', passport.authenticate('facebook',{scope:''}));

fb_router.get('/callback',
passport.authenticate('facebook', { successRedirect : '/', failureRedirect: '/login' }),
function(req, res) {
    res.redirect('/');
});


function ensureAuthenticated(req, res, next) {
if (req.isAuthenticated()) { return next(); }
res.redirect('/login')
}
export default fb_router;
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import router from '../routes/auth.route';
import gg_router from '../routes/google/passpost';
import fb_router from '../routes/facebook/passport';
import session from 'express-session';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
const app = express();
dotenv.config();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  secret: process.env.COOKIE_KEY, // Replace with your own secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

  
// app.use(
//     session({
//       secret: process.env.COOKIE_KEY || 'default_secret', // Replace with your own secret key
//       resave: false,
//       saveUninitialized: true,
//       cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 } // 1 day
//     })
//   );
// app.use(passport.initialize());
// app.use(passport.session());

app.use(express.urlencoded({ extended: true, limit: '100kb' }));

app.use("/api", router);
app.use("/auth/google",gg_router)
app.use("/auth/facebook",fb_router)
// const server = http.createServer(app);

export default app;

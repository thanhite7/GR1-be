import { connect } from "http2";
import app from "./configs/server.config";
import { connectDB } from "./db/connectDb";
const HOST = process.env.HOST || 'http://localhost';
const PORT = process.env.PORT || 3000;

connectDB().then(()=>{
app.listen(PORT, () => console.log(`Server running on ${HOST}:${PORT}`));})
import { connect } from "http2";
import server from "./configs/server.config";
import { connectDB } from "./db/connectDb";
const HOST = process.env.HOST || 'http://localhost';
const PORT = process.env.PORT || 3000;

connectDB().then(()=>{
server.listen(PORT, () => console.log(`Server running on ${HOST}:${PORT}`));})
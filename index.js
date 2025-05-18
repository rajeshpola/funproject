import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import cors from "cors"
const app = express();
import connectDB from './utils/db.js'
import { log } from 'console';
import cookieParser from 'cookie-parser';
import router from './routes/user.routes.js'; 

dotenv.config();
const port = 8080;
app.use(express.json());
app.use(urlencoded({extended:true}));
app.use(cookieParser());

app.use(cors({
  origin:'http://localhost:3000',
  credentials:true,
  methods:['GET','POST','DELETE','OPTIONS'],
  allowedHeaders:['Content-Type','Authorization']
}))


app.use(router);
app.get('/', (req, res) => {
res.send("listening")
})


app.get('/rajesh',(req,res)=>{
    res.send("rajessh")
})




connectDB() ;


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  
  
})

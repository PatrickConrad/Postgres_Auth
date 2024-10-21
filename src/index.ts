import express, { Express } from 'express';
import dotenv from 'dotenv';
import appRouter from './router'
import {corsSetup} from './config/cors';
import { comparePassword, hashPassword } from './helpers/crypto';
import { validatePassword } from './helpers/inputValidation';

dotenv.config();

const app: Express = express();

if(process.env.NODE_ENV === 'development') app.enable('trust proxy');


app.use(express.json()); 

app.use(express.urlencoded({extended: true}));


 
app.use('/api/v1', appRouter);


const testPasswords = async () =>{
  const hashed = await hashPassword('123456', 10);
  console.log({hashed});
  const passes = await comparePassword('123456', hashed)
  console.log({passes})
}
testPasswords()


const port = process.env.PORT||8081;
 
app.listen(port, () => {
  console.log(`Server is running at this http://localhost:${port}`);
});  
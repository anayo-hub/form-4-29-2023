import express from 'express';
import cors from 'cors';
import morgan from 'morgan';


const app = express();

/** middlewares */
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by'); // less hackers know about our stack

const port = 8000;

// http get request
app.get('/', (req,res)=>{
    res.status(201).json("Home Page Request")
})

//
app.listen(port, ()=>{
    console.log(`Server connected to http://localhost:${port}`);
})
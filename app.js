const express = require('express');
app = express();
const connectDB = require('./db/connect');
const auth = require('./routes/auth');
const picks = require('./routes/picks');
require('dotenv').config();

// Security
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// Middleware

// Routes

// Error Handler

app.use(express.json());
app.use('/api/v1',[picks,auth]);
//app.use(helmet());
app.use(cors());
app.use(xss());

const port = 3000;

const start = async ()=>{
    try{
        await connectDB(process.env.MONGO_URI);
        app.listen(port,console.log(`Server is listening on port ${port}`));
    }
    catch(error){
        console.log(error);
    }
}

start();
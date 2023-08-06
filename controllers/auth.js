// Need to register a user
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes')

const register = async (req,res)=>{
    const user = await User.create(req.body);
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({user,token});
}

const login = async (req,res)=>{
    const {name,password} = req.body;

    if(!name || !password){
        return res.status(StatusCodes.BAD_REQUEST).send('Incorrect username or password');
    }
    const user = await User.findOne({name});
    if(!user){
        return res.status(StatusCodes.NOT_FOUND).send('Incorrect username or password');
    }
    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        return res.status(StatusCodes.UNAUTHORIZED).send('Incorrect username or password');
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({user,token});
}

module.exports = {
    register,
    login
}
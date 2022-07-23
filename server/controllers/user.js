import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import User from '../models/user.js';

export const signin = async (req, res) => {
    const {email, password} = req.body;

    try {
        const existingUser = await User.findOne({email});
        if(!existingUser) return res.status(404).json({message: "User doesn't exist."})

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials"});

        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, 'test', {expiresIn: "24h"});

        res.status(200).json({result: existingUser, token});

    } catch(error) {
        res.status(500).json({message: 'Something went wrong.'});
    }
}
export const signup = async (req, res) => {
    const {email, password, confirmPassword, firstName, lastName} = req.body;

    try {
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({message: "User already exists"});

        if(password !== confirmPassword) return res.status(400).json({message: "Passwords don't match"});

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({email, password: hashedPassword, name: `${firstName} ${lastName}`});

        const token = jwt.sign({email: result.email, id: result._id}, 'test', {expiresIn: "24h"});
        
        res.status(200).json({result: result, token});
    } catch (error) {
        res.status(500).json({message: 'Something went wrong.', error: error});
    }
}

export const googleSignin = async ( req, res ) => {
    const { access_token } = req.query;
    try {
        const response = await axios({
            method: 'get',
            url: `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`,
        })

        console.log('testing response', response.data);
        const existingUser = await User.findOne({email : response.data.email});

        let result, hashedPassword, token;
        if(!existingUser) {
            hashedPassword = await bcrypt.hash(response.data.sub, 12);
            result = await User.create({email: response.data.email, password: hashedPassword, name: response.data.name, profile: response.data.picture});
            token = jwt.sign({email: result.email, id: result._id}, 'test', {expiresIn: "24h"});
            res.status(200).json({result: result, token});
        }
        else {
            token = jwt.sign({email: existingUser.email, id: existingUser._id}, 'test', {expiresIn: "24h"});
            res.status(200).json({result: existingUser, token});
        }
        

    } catch (error) {
        console.log('error phonehtu', error);
        res.status(500).json({ message: 'Something went wrong.', error: error });
    }

}
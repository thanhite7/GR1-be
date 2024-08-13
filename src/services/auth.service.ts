import User from '../model/user.model';
import createHttpError from 'http-errors';
import { generateAccessToken } from '../utils/jwt.ulti';
import {hash,compare} from 'bcrypt';
const findAllUsers = async (pagination:{page:any,pageSize:any},keyword:any) => {
    try{
        const page = parseInt(pagination.page);
        const pageSize = parseInt(pagination.pageSize);
        const Users = await User.find()
        // .limit(pageSize).skip((page-1)*pageSize);
        const user_nums = await User.find().countDocuments();
        console.log('user_nums', user_nums);
        if(!Users){
            return null;
        }
        return {Users,user_nums};
    }
    catch(error){
        return null;
    }
}

const login = async (email:string,password:string) => {
    try{
        const emailUser = await User.findOne({
            email:email

        });
        if(!emailUser){
            throw createHttpError(404, 'Username Not Found');
        }
        const isValid = await compare(password,emailUser.password);
        if(!isValid){
            throw createHttpError(401, 'Invalid Password');
        }
        
        return generateAccessToken(emailUser);
        
    }catch(error){
        return null;
    }
}

const register = async (name:string,email:string,password:string,phone_number:string,address:string,role:string) => {

    try{
        const hashedPassword = await hash(password,10);
        const user = await User.create({
            name:name,
            email:email,
            password:hashedPassword,
            phone_number:phone_number,
            address:address,
            role:role==""?"admin":role
        });


        if(!user){
            return null;
        };
        return user;
    }catch(error){
        return null;
    }
}

const deleteUser = async (userId:string) => {
    try{
        const user = await User.findByIdAndDelete(userId);
        if(!user){
            return null;
        }
        return user;
    }catch(error){
        return null;
    }
}
const updateUser = async (userId:string,email:string,name:string,phone_number:string,address:string,role:string) => {
    try{

        const updatedUser = await User.findByIdAndUpdate(userId,{
            email:email,
            name:name,
            phone_number:phone_number,
            address:address,
            role:role
        },{new:true});
        const jwt_token = generateAccessToken(updatedUser);
        console.log('updatedUser', updatedUser);
        return {updatedUser,jwt_token};

    }catch(error){
        return null;
    }
}

const changePassword = async (userId:string,newPassword:string,oldPassword:string) => {
    try{
        const user = await User.findById(userId);
        const isMatched = await compare(oldPassword,user.password);
        if(!isMatched){
            return null;
        }
        user.password = await hash(newPassword,10);
        await user.save();
        delete user.password;
        return user;

    }catch{
        return null;
    }
}

const getUserInfo = async (userId:string) => {
    try{
        const user = await User.findById(userId)
        if(!user){
            return null;
        }
        return user;
    }catch(error){
        return null;
    }

}

export default {findAllUsers,login,register, deleteUser,updateUser,changePassword,getUserInfo}
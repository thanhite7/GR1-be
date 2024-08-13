import { NextFunction ,Request,Response} from "express";
import User from '../model/user.model';
import UserService from "../services/auth.service";
import { decodeToken } from "../utils/jwt.ulti";
const getAllUsers = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const {Users,user_nums} = await UserService.findAllUsers(
                {
                page:req.query.page || 1,
                pageSize:req.query.pageSize || 6,
                },
                req.query.keyword
            
        );
        if(!Users){
            return res.status(404).json({message: "No users found"});
        }
        const filteredUsers = Users.map(user=>({
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            provider:user.provider, 
            googleId:user.googleId,
            facebookId:user.facebookId,
            phone_number:user.phone_number,
            address:user.address,
        }))
        return res.status(200).json({message:"OK",filteredUsers,user_nums});
    } catch (error) {
        next(error);
    }
}
const login  = async (req: Request, res: Response, next:NextFunction) => {
    try{
        const {email,password} = req.body;
        const emailUser = await User.findOne({
            email:email,
        });
        console.log(emailUser);
        if(!emailUser || emailUser.googleId){
            return res.status(404).json({message:"Email does not exists"});
        }
        const jwt_token = await UserService.login(email,password);
        if(!jwt_token){
            return res.status(401).json({message:"Email or password is incorrect"});
        }
        res.clearCookie("auth_token",{path:"/",domain:"localhost",httpOnly:true,signed:true});
        const expires = new Date();
        expires.setDate(expires.getDate()+7);
        
        res.cookie("auth_token",jwt_token,{path:"/",domain:"localhost",expires,httpOnly:true,signed:true})
        return res.status(200).json({message:"OK",jwt_token});
    }
    catch(error){
        next(error);
    }

}
const register  = async (req: Request, res: Response,next:NextFunction) => {

    try{
        const {name, email,password,phone_number,address,role} = req.body;
        const existedEmail = await User.find({email});
        existedEmail.map((user)=>{ 
            if(user.googleId==null){
                return res.status(401).json({message:"Email already exists"});
            }
        })
        const user = await UserService.register(name,email,password,phone_number,address,role);
        if(!user){
            return res.status(400).json({message:"Cannot register user"});
        }
        return res.status(200).json({message:"OK",user});
    }
    catch(error){
        next(error);
    }
}
const deleteUser = async (req: Request, res: Response,next:NextFunction) => {
    try{
        const userId = req.params.userId;
        const user = await UserService.deleteUser(userId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        return res.status(200).json({message:"OK",user});
    }
    catch(error){
        next(error);
}
}

const getProfile = async (req: Request, res: Response,next:NextFunction) => {
    try{
        const userInfo = decodeToken(req.get('Authorization').split(' ')[1]);
        return res.status(200).json({message:"OK",userInfo});
    }
    catch(error){
        next(error);
    }
}

const updateUser = async (req: Request, res: Response,next:NextFunction) => {
    try{
        const userId = req.params.userId;
        const {email,name,phone_number,address,role} = req.body;
        const {updatedUser,jwt_token} = await UserService.updateUser(userId,email,name,phone_number,address,role);
        if(!updatedUser){
            return res.status(404).json({message:"Can not update User"});
        }
        return res.status(200).json({message:"OK",updatedUser,jwt_token});
    }catch(error){
        next(error);
    }
}
const changePassword = async (req: Request, res: Response,next:NextFunction) => {
    try{
        const {userId,newPassword,oldPassword} = req.body;
        const result = await UserService.changePassword(userId,newPassword,oldPassword);
        if(!result){
            return res.status(400).json({message:"Cannot change password"});
        }
        return res.status(200).json({message:"OK",result});
    }catch(error){
        next(error);
    }
}
const getUserInfo = async (req: Request, res: Response,next:NextFunction) => {
    try{
        const userId = req.params.userId;
        const user = await UserService.getUserInfo(userId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        return res.status(200).json({message:"OK",user});
    }catch(error){
        next(error)
    }
}



export default {getAllUsers,login, register, deleteUser,getProfile,updateUser,changePassword,getUserInfo}
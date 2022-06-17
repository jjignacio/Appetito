import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose'; 
import { User } from './interfaces/users.interface'
import { createUserDTO } from './dto/users.dto'

@Injectable()
export class UsersService {

    constructor(@InjectModel('User') private userModel: Model<User>) {}
    

    async getUsers(): Promise<User []> {
        const users = await this.userModel.find();
        return users;
    }

    async getUser(userId: string): Promise<User>  {
        const user = await this.userModel.findById(userId);
        return user;
    }

    /*async createUser(createUserDTO: createUserDTO ): Promise<User>  {
        const user = new this.userModel(createUserDTO);
        return await user.save();
    }*/

    async checkAlias(postData): Promise<User>  {
        const user = await this.userModel.findOne({ alias: postData.alias});
        if(user) {
            const optionalUser1 = postData.alias + (Math.floor(100000 + Math.random() * 900000));
            const optionalUser2 = postData.alias + (Math.floor(100000 + Math.random() * 900000));
            const optionalUser3 = postData.alias + (Math.floor(100000 + Math.random() * 900000));
            const optionalUser4 = postData.alias + (Math.floor(100000 + Math.random() * 900000));
            const AliasOptions = new this.userModel({aliasOptions1: optionalUser1, aliasOptions2: optionalUser2, aliasOptions3: optionalUser3, aliasOptions4: optionalUser4});
            return AliasOptions;    
        }
    }

    async checkEmail(postData): Promise<Boolean>  {
        const user = await this.userModel.findOne({ email: postData.email});
        if(user) {
            if(user.enabled) {
                return true;
            } else {
                return false;
            }
        }
    }

    async createUser(postData): Promise<User>  {
        // const user = new this.userModel(postData);
        const user = new this.userModel({name: "", password: "", alias: postData.alias, enabled: false, email: postData.email, role: "Invitado", gender: "", birth: ""});
        return await user.save();
    }

    async updateUser(userId: string, createUserDTO: createUserDTO): Promise<User>   {
        const updatedUser = await this.userModel.findByIdAndUpdate(userId, createUserDTO, {new : true});
        return updatedUser;
    }

    async deleteUser(userId: string): Promise<User>  {
        const deletedUser = await this.userModel.findByIdAndDelete(userId);
        return deletedUser;
    }

    async login(postData): Promise<User>  {
        var user;
        if(!postData.email) {
            user = await this.userModel.findOne({ alias: postData.alias, password: postData.password});
        } else if (!postData.alias){
            user = await this.userModel.findOne({ email: postData.email, password: postData.password});
        }
        return user;
    }
}

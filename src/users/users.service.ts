import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose'; 
import { User } from './interfaces/users.interface'
import { Alias } from './interfaces/alias.interface'
import { createUserDTO } from './dto/users.dto'

@Injectable()
export class UsersService {

    constructor(@InjectModel('User') private userModel: Model<User>, @InjectModel('AliasOptions') private aliasModel: Model<Alias>) {}
    

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

    async checkAlias(postData): Promise<Alias>  {
        const user = await this.userModel.findOne({ alias: postData.alias});
        if(user) {
            const optionalUser1 = postData.alias + (Math.floor(100000 + Math.random() * 900000));
            const optionalUser2 = postData.alias + (Math.floor(100000 + Math.random() * 900000));
            const optionalUser3 = postData.alias + (Math.floor(100000 + Math.random() * 900000));
            const optionalUser4 = postData.alias + (Math.floor(100000 + Math.random() * 900000));
            const AliasOptions = this.aliasModel.create({option1: optionalUser1, option2: optionalUser2, option3: optionalUser3, option4: optionalUser4});
            return AliasOptions;    
        }
    }

    async createUser(postData): Promise<User>  {
        const user = new this.userModel(postData);
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

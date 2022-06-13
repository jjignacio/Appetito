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

    async createUser(createUserDTO: createUserDTO ): Promise<User>  {
        const user = new this.userModel(createUserDTO);
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

    async getUserByMail(createUserDTO: createUserDTO): Promise<User>  {
        //const user = await this.userModel.findOne({ email: createUserDTO.email, password: createUserDTO.password});
        const user = await this.userModel.findOne({ email: "fede@uade.edu.ar", password: "TestAPPetito2"});
        return user;
    }
}

import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose'; 
import { User } from './interfaces/users.interface';
import { createUserDTO } from './dto/users.dto';
import { ServiceUnavailableException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {

    constructor(@InjectModel('User') private userModel: Model<User>, private readonly mailerService: MailerService) {}
    

    async getUsers(): Promise<User []> {
        const users = await this.userModel.find();
        return users;
    }

    async getUser(userId: string): Promise<User>  {
        const user = await this.userModel.findById(userId);
        return user;
    }

    async getUserByEmail(userEmail: string): Promise<User>  {
        const user = await this.userModel.findOne({ email: userEmail});
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

    async checkEmail(postData): Promise<User>  {
        const user = await this.userModel.findOne({ email: postData.email});
        if(user) {
            return user;
        }
    }

    async createUser(postData): Promise<User>  {
        // const user = new this.userModel(postData);
        let temporalPassword = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < 10; i++) {
            temporalPassword += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        try {
            // send mail with defined transport object
            await this.mailerService.sendMail({
                from: '"Registro de usuario - APPetito" <securesally@gmail.com>', // sender address
                to: postData.email, // list of receivers
                subject: "Registro de usuario - APPetito", // Subject line
                html: `<p>Hola,</p><p>Para finalizar el registro en la aplicación debe ingresar la siguiente contraseña temporal, la cual tiene una vigencia de 24 horas:</p><div style='display: flex; gap: 30px; margin-top: 1.5rem!important; margin-bottom: 1.5rem!important; padding-right: .75rem; padding-left: .75rem;'><div style='position: relative; display: flex; flex-direction: column; min-width: 0; word-wrap: break-word; background-color: #fff; background-clip: border-box; border: 1px solid rgba(0,0,0,.125); border-radius: 0.25rem; width: 50%;'><div style='width: 100%; text-align: center !important;'><div style='font-size: 2rem; line-height: 1.5;'><p>${temporalPassword}</p></div></div></div></div></div><p>Saludos, </p><p>- El equipo de APPetito.</p>` // html body
            });
        } catch (error) {
            throw new ServiceUnavailableException(error);
        }
        const user = new this.userModel({
            name: "", 
            password: temporalPassword, 
            alias: postData.alias, 
            enabled: false, 
            email: postData.email, 
            role: "Invitado", 
            gender: "", 
            birth: "", 
            recoveryCode: "", 
            image: "https://img.freepik.com/vector-gratis/perfil-avatar-hombre-icono-redondo_24640-14044.jpg?w=740",
            favorites: {idReceta: "", nameReceta: "", createdAt: ""},
            recetas: {idReceta: "", nameReceta: "", createdAt: ""} });
        return await user.save();
    }

    async updateUserWithAlias(userAlias: string, createUserDTO: createUserDTO): Promise<User>   {
        const updatedUser = await this.userModel.findOneAndUpdate({alias: userAlias}, createUserDTO, {new : true});
        return updatedUser;
    }

    async updateUserWithEmail(userMail: string, createUserDTO: createUserDTO): Promise<User>   {
        const updatedUser = await this.userModel.findOneAndUpdate({email: userMail}, createUserDTO, {new : true});
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

    // Verifica que el usuario este completo y con perfil Invitado para generar un codigo de recupero y enviarlo por mail.
    async recoverPassword(userEmail): Promise<User>  {
        var user = await this.userModel.findOne({ email: userEmail });
        if(user.enabled && user.role.localeCompare("Invitado") == 0) {
            let recoveryCode = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            for (let i = 0; i < 6; i++) {
                recoveryCode += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            try {
                // send mail with defined transport object
                await this.mailerService.sendMail({
                    from: '"Recupero de contraseña - APPetito" <securesally@gmail.com>', // sender address
                    to: userEmail, // list of receivers
                    subject: "Recupero de contraseña - APPetito", // Subject line
                    html: `<p>Hola,</p><p>Para restaurar tu contraseña ingresá el siguiente código en la aplicación:</p><div style='display: flex; gap: 30px; margin-top: 1.5rem!important; margin-bottom: 1.5rem!important; padding-right: .75rem; padding-left: .75rem;'><div style='position: relative; display: flex; flex-direction: column; min-width: 0; word-wrap: break-word; background-color: #fff; background-clip: border-box; border: 1px solid rgba(0,0,0,.125); border-radius: 0.25rem; width: 50%;'><div style='width: 100%; text-align: center !important;'><div style='font-size: 2rem; line-height: 1.5;'>${recoveryCode}</div></div></div></div></div><p>Si tú no iniciaste el proceso para recuperar tu contraseña, ignora este mail y no sucederá nada.</p><p>Saludos, </p><p>- El equipo de APPetito.</p>` // html body
                });
            } catch (error) {
                throw new ServiceUnavailableException(error);
            }
            const userUpdated = await this.userModel.findOneAndUpdate({email: userEmail}, { recoveryCode: recoveryCode }, {new : true});
            return userUpdated;
        } else {
            throw new ForbiddenException();
        }
    }

    async updatePassword(userEmail, postData): Promise<User>  {
        var user = await this.userModel.findOne({ email: userEmail });
        if(user.recoveryCode.localeCompare(postData.recoveryCode) == 0) {
            const userRecover = await this.userModel.findOneAndUpdate({email: userEmail}, { password: postData.password, recoveryCode: "" }, {new : true});
            return userRecover;
        } else {
            throw new BadRequestException();
        }
    }

    async createFavorite(userMail: string, postData): Promise<User>   {
        //const userUpdated = await this.userModel.findOneAndUpdate({ email: userMail}, { $push: { favorites: postData } });
        //const userUpdated = await user.update({ $push: { favorites: postData } });
        
        


        const updatedUser = await this.userModel.findOneAndUpdate({email: userMail}, { $push: {favorites: [{idReceta: postData.idReceta, nameReceta: postData.nameReceta, createdAt: postData.createdAt}]}}, {new : true});
        return updatedUser;
    }
}

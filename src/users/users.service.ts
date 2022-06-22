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
                html: `<p>Hola,</p><p>Para finalizar el registro en la aplicación debe ingresar la siguiente contraseña temporal, la cual tiene una vigencia de 24 horas:</p><div style='display: flex; gap: 30px; margin-top: 1.5rem!important; margin-bottom: 1.5rem!important; padding-right: .75rem; padding-left: .75rem;'><div style='position: relative; display: flex; flex-direction: column; min-width: 0; word-wrap: break-word; background-color: #fff; background-clip: border-box; border: 1px solid rgba(0,0,0,.125); border-radius: 0.25rem; width: 50%;'><div style='display: flex; width: 100%; justify-content: center !important;'><div style='font-size: 2rem; line-height: 1.5;'><p>${temporalPassword}</p></div></div></div></div></div><p>Saludos, </p><p>- El equipo de APPetito.</p>` // html body
            });
        } catch (error) {
            throw new ServiceUnavailableException(error);
        }
        const user = new this.userModel({name: "", password: temporalPassword, alias: postData.alias, enabled: false, email: postData.email, role: "Invitado", gender: "", birth: "", recoveryCode: "", image: "https://img.freepik.com/vector-gratis/perfil-avatar-hombre-icono-redondo_24640-14044.jpg?w=740"});
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
                    //to: userEmail, // list of receivers
                    to: "juanignacio.marquez@concentrix.com", // list of receivers
                    subject: "Recupero de contraseña - APPetito", // Subject line
                    //html: `<p>Hola,</p><p>Para restaurar tu contraseña ingresá el siguiente código en la aplicación:</p><div style='display: flex; gap: 30px; margin-top: 1.5rem!important; margin-bottom: 1.5rem!important; padding-right: .75rem; padding-left: .75rem;'><div style='position: relative; display: flex; flex-direction: column; min-width: 0; word-wrap: break-word; background-color: #fff; background-clip: border-box; border: 1px solid rgba(0,0,0,.125); border-radius: 0.25rem; width: 50%;'><div style='display: flex; width: 100%; justify-content: center !important;'><div style='font-size: 2rem; line-height: 1.5;'>${recoveryCode}</div></div></div></div></div><p>Si tú no iniciaste el proceso para recuperar tu contraseña, ignora este mail y no sucederá nada.</p><p>Saludos, </p><p>- El equipo de APPetito.</p>` // html body
                    html: `<!DOCTYPE HTML><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'></head><body style='background-color: ghostwhite !important; font-family: sans-serif; min-height: 100vh; margin: 0px !important;'><div><a href='https://www.metrogas.com.ar'><img style='border: currentColor; border-image: none; height: 79px;' alt='MetrogasHeader' src='https://webapps.metrogas.com.ar/firma/MGAS_Mailing_Top_Corto.png'></a><br></div><form><div style='max-width: 600px;'><div style='padding-right: .75rem; padding-left: .75rem; margin-top: 1.5rem!important;'><div style='display: flex; align-items: center!important;'><div style='margin-right: 5px;'>Hola</div><div style='width: 65%;'><input id='%SAP_ZNOTIF_CONTEXTO_ATRIBUTOS-NOMBRE_COMPLETO' dir='ltr' value='Nombre y Apellido o Razon Social' style='display: block; border: 0; width: 100%; font-weight: 400; line-height: 1.5; color: #212529; text-align: center; background-clip: padding-box; appearance: none; transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out; background-color: ghostwhite !important; width: 65%;'></div><div>,</div></div><p style='margin-top: 5px;'>tu nueva factura de MetroGAS se encuentra disponible:</p></div><div style='display: flex; gap: 30px; margin-top: 1.5rem!important; margin-bottom: 1.5rem!important; padding-right: .75rem; padding-left: .75rem;'><div style='position: relative; display: flex; flex-direction: column; min-width: 0; word-wrap: break-word; background-color: #fff; background-clip: border-box; border: 1px solid rgba(0,0,0,.125); border-radius: 0.25rem; width: 100%;'><div style='flex: 1 1 auto; padding: 1rem 1rem;'><div style='font-size: 1.3rem; color: #0072bc !important; font-weight: 700;'>Total a pagar</div><div style='display: flex;'><div style='font-size: 2.2rem; line-height: 1.5; margin-right: 70px;'><input id='%SAP_ZNOTIF_CONTEXTO_ATRIBUTOS-IMPORTE_FACTURA_CUPON' dir='ltr' value='Importe de la factura / cupón' style='display: block; border: 0; width: 100%; font-weight: 400; line-height: 1.5; color: #212529; text-align: center; background-clip: padding-box; appearance: none; transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out; font-size: 2.2rem; text-align: left !important;'></div><div style='font-size: 0.8rem; font-weight: 300!important; line-height: 18px; margin-top: 5px'>FECHA DE EMISIÓN<br><input id='%SAP_ZNOTIF_CONTEXTO_ATRIBUTOS-FECHA_EMISION' dir='ltr' value='Fecha de Emisión' style='text-align: left !important; display: block; border: 0; width: 100%; font-weight: 400; line-height: 1.5; color: #212529; text-align: center; background-clip: padding-box; appearance: none; transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out; font-weight: 300!important;'></div></div><a href='google.com.ar' style='display: inline-block; font-weight: 400; line-height: 1.5; color: #fff; text-align: center; text-decoration: none; vertical-align: middle; cursor: pointer; border-color: #0d6efd; user-select: none; border: 1px solid transparent; padding: 0.375rem 0.75rem; font-size: 1rem; border-radius: 0.25rem; background-color: #0072bc !important; margin-top: 1rem!important;'>Descargar factura</a></div></div></div></div><div style='max-width: 600px;'><div style='display: flex; margin-bottom: 1.5rem!important; padding-right: .75rem; padding-left: .75rem;'><div style='position: relative; margin-right: 20px; min-width: 0; word-wrap: break-word; background-color: #fff; background-clip: border-box; border: 1px solid rgba(0,0,0,.125); border-radius: 0.25rem; width: 50%;'><div style='flex: 1 1 auto; padding: 1rem 1rem;'><div style='display: flex; margin-bottom: 15px;'><div style='width: 40%; text-align: right;'><img style='width: 39px; height: 39px; padding: 25px 10px 0px 0px;' alt='CreditCard' src='https://webapps.metrogas.com.ar/firma/MGAS_Mailing_Credit_Card.png'></div><div style='width: 50%;'><p style='font-size: 18px; color: #0072bc !important; font-weight: 700;'>Pagá tu<br>saldo online</p></div></div><div style='text-align: center;'><a href='google.com.ar' style='display: inline-block; font-weight: 400; line-height: 1.5; color: #fff; text-align: center; text-decoration: none; vertical-align: middle; cursor: pointer; border-color: #0d6efd; user-select: none; border: 1px solid transparent; padding: 0.375rem 0.75rem; font-size: 1rem; border-radius: 0.25rem; background-color: #0072bc !important; width: 150px; height: 30px;'>Pagar</a></div></div></div><div style='position: relative; display: flex; flex-direction: column; min-width: 0; word-wrap: break-word; background-color: #fff; background-clip: border-box; border: 1px solid rgba(0,0,0,.125); border-radius: 0.25rem; width: 50%;'><div style='flex: 1 1 auto; padding: 1rem 1rem; min-width: 90%;'><div style='display: flex; margin-bottom: 15px;'><div style='width: 40%; text-align: right;'><img style='width: 39px; height: 39px; padding: 25px 10px 0px 0px;' alt='Calendar' src='https://webapps.metrogas.com.ar/firma/MGAS_Mailing_Calendar.png'></div><div style='width: 50%;'><p style='font-size: 18px; color: #0072bc !important; font-weight: 700;'>Fecha de<br>vencimiento</p></div></div><div style='font-size: 1.3rem; font-weight: 400; line-height: 1.5; text-align: center;'><input id='%SAP_ZNOTIF_CONTEXTO_ATRIBUTOS-FECHA_VENCIMIENTO' dir='ltr' value='Fecha de vencimiento' style='font-size: 1.3rem; display: block; border: 0; width: 100%; font-weight: 400; line-height: 1.5; color: #212529; text-align: center; background-clip: padding-box; appearance: none; transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;'></div></div></div></div></div><div style='margin-left: 0cm; margin-top: 0cm'><div style='position: relative;top: 4px'><a href='https://ecommerce.metrogas.com.ar/?utm_source=envios_propios&amp;utm_medium=email&amp;utm_campaign=banner_mailing'><img style='border: currentColor; border-image: none; width: 600px;' src='https://webapps.metrogas.com.ar/firma/Banners_Detector_OK_mailing.jpg'></a></div><div style='width: 600px; height: 40px; text-align: center; background-color:#00BBF2;'><ul style='list-style: none; margin: 0px; padding: 0px; width: 100%; height: 100%; display: inline-table;'><li style='margin: auto 0px; display: inline;'><a style='text-align: center; text-decoration: none;' href='https://www.facebook.com/MetroGAS'><img style='border: currentColor; border-image: none; width: 39px; height: 39px;' alt='Facebook' src='https://webapps.metrogas.com.ar/firma/Redes%20metro_facebook.jpg'></a></li><li style='margin: auto 0px; display: inline;'><a style='text-align: center; text-decoration: none;' href='https://www.instagram.com/metrogas_ar'><img style='border: currentColor; border-image: none; width: 39px; height: 39px;' alt='Instagram' src='https://webapps.metrogas.com.ar/firma/Redes%20metro_instagram.jpg'></a></li><li style='margin: auto 0px; display: inline;'><a style='text-align: center; text-decoration: none;' href='https://www.youtube.com/channel/UCWcNyJp_uEBFZBE8q2LzQ5w'><img style='border: currentColor; border-image: none; width: 39px; height: 39px;' alt='Youtube' src='https://webapps.metrogas.com.ar/firma/Redes%20metro_youtube.jpg'></a></li><li style='margin: auto 0px; display: inline;'><a style='text-align: center; text-decoration: none;' href='https://www.linkedin.com/company/metrogas/'><img style='border: currentColor; border-image: none; width: 39px; height: 39px;' alt='Linkedin' src='https://webapps.metrogas.com.ar/firma/Redes%20metro_linkedin.jpg'></a></li></ul></div><div style='width: 100%; text-align: justify; max-width: 600px; color: #6c757d!important; margin-top: 0.5rem!important;'><h5 style='font-size: 8px !important; font-weight: 400 !important;'>Te enviamos esta información porque te adheriste al servicio de Factura Digital de MetroGAS S.A.<br><br>Para garantizar la recepción de nuestros correos electrónicos en tu bandeja de entrada, incorporá la dirección: no-reply@metrogas.com.ar a tu listado de correo deseado. No respondas a este correo electrónico ya que la dirección no se encuentra habilitada para recibir mensajes.<br><br>Este correo electrónico fue enviado y su contenido es confidencial.<br><br>Si deseas cancelar la suscripción a Factura Digital, Hace <a href='https://urldefense.proofpoint.com/v2/url?u=http-3A__facturasonline.metrogas.com.ar_&amp;d=DwMF-g&amp;c=eIGjsITfXP_y-DLLX0uEHXJvU8nOHrUK8IrwNKOtkVU&amp;r=SGrP4GD9aXP1qpCpiaWGOLz7WPEfrCcYvKpiawAHTZE&amp;m=rbSVQT6ottrmV0Jpc9MW_Q-MSrcS2avc21OK5513AAM&amp;s=86frZ4U8bhsbc8Ckt057u8-OlOajn2MxuwApfAgLITw&amp;e='>click aqui</a><br><br>LA AGENCIA DE ACCESO A LA INFORMACION PUBLICA, en su carácter de Organo de Control de la Ley Nro. 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes en materia de protección de datos personales (conforme artículo 3 de la Resolución 14/2018 de la Agencia de Acceso a la Información Pública).<br><br>El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto, conforme lo establecido en el artículo 14, inciso 3 de la Ley Nro 25.326. El titular, además, tiene la facultad de ejercer el derecho de rectificación, actualización, supresión o confidencialidad de los mismos, conforme lo establecido en el artículo 16 de la Ley Nro. 25.326 y el Decreto Reglamentario 1558/2001. El titular podrá ejercer los derechos mencionados mediante nota dirigida a MetroGAS S.A., con domicilio en Gregorio Aráoz de Lamadrid 1.360, C.A.B.A.<br><br>Más información en www.metrogas.com.ar.</h5></div></div></form></body></HTML>`
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
}

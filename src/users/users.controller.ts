import { Controller, Get, Post, Put, Delete, Res, HttpStatus, Body, Param, NotFoundException } from '@nestjs/common';
import e from 'express';
import { createUserDTO } from './dto/users.dto';

import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {

    constructor(private userService: UsersService) {}

    /*@Post('/create')
    async createPost(@Res() res, @Body() createUserDTO: createUserDTO) {
        //console.log(createUserDTO);
        const user = await this.userService.createUser(createUserDTO)
        return res.status(HttpStatus.OK).json({
            message: 'received',
            user: user
        });
    }*/

    @Post('/create')
    async createPost(@Res() res, @Body() postData: { email: string; alias: string}) {
        const alias = await this.userService.checkAlias(postData)
        const email = await this.userService.checkEmail(postData)
        if(alias) {
            return res.status(HttpStatus.OK).json({
                message: 'received',
                alias: alias
            });
        } else if (email) {
            if (email.enabled) {
                return res.status(HttpStatus.OK).json({
                    message: 'Dar la opcion de recuperar contraseña.',
                    email: true
                });
            } else {
                return res.status(HttpStatus.OK).json({
                    message: 'No se puede usar este mail para registrarse.',
                    email: false
                });
            }
        } else {
            const user = await this.userService.createUser(postData)
            return res.status(HttpStatus.OK).json({
                message: '201 - (Created) Usuario creado.',
                user: user
            });
        }
        
    }

    @Get('/')
    async getUsers(@Res() res) {
        const users = await this.userService.getUsers();
        return res.status(HttpStatus.OK).json({
            message: 'received',
            users: users
        }); 
    }

    @Get('/:userId')
    async getUser(@Res() res, @Param('userId') userId ) {
        const user = await this.userService.getUser(userId);
        if (!user) throw new NotFoundException('El usuario no existe');
        return res.status(HttpStatus.OK).json({
            message: 'received',
            user: user
        }); 
    }

    @Delete('/delete/:userId')
    async deleteUser(@Res() res, @Param('userId') userId ) {
        const userDeleted = await this.userService.deleteUser(userId);
        if (!userDeleted) throw new NotFoundException('El usuario no existe');
        return res.status(HttpStatus.OK).json({
            message: 'Usuario eliminado correctamente',
            userDeleted: userDeleted
        }); 
    }

    @Put('/update/:userId')
    async updateUser(@Res() res, @Param('userId') userId, @Body() createUserDTO: createUserDTO ) {
        if(userId.includes("@")) {
            const userUpdated = await this.userService.updateUserWithEmail(userId, createUserDTO);
            if (!userUpdated) throw new NotFoundException('400 - (Bad Request) Los datos enviados son incorrectos o hay datos obligatorios no enviados.');
            return res.status(HttpStatus.OK).json({
                message: '200 - (Created) Usuario actualizado.',
                userUpdated: userUpdated
            });
        } else {
            const userUpdated = await this.userService.updateUserWithAlias(userId, createUserDTO);
            if (!userUpdated) throw new NotFoundException('400 - (Bad Request) Los datos enviados son incorrectos o hay datos obligatorios no enviados.');
            return res.status(HttpStatus.OK).json({
                message: '200 - (Created) Usuario actualizado.',
                userUpdated: userUpdated
            });
        }
    }

    @Post('/login')
    async loginPost(@Res() res, @Body() postData: { email?: string; alias?: string; password: string}) {
        const user = await this.userService.login(postData)
        if (!user) throw new NotFoundException('404 - (NotFound) No se encontró información');
        return res.status(HttpStatus.OK).json({
            message: '201 - (Created) Usuario logueado',
            user: user
        });
    }

    @Put('/recover/:userEmail')
    async recoverPassword(@Res() res, @Param('userEmail') userEmail, @Body() postData: {password?: string; recoveryCode?: string;}) {
        if(postData.password) {
            const user = await this.userService.getUserByEmail(userEmail);
            if (!user) {
                throw new NotFoundException('404 - (NotFound) No se encontró información');
            } else {
                const updateUserPassword = await this.userService.updatePassword(userEmail, postData);
                if (!updateUserPassword) throw new NotFoundException('404 - (NotFound) No se encontró información');
                return res.status(HttpStatus.OK).json({
                    message: '200 - Contraseña actualizada',
                    user: updateUserPassword
                });
            }
        } else {
            const user = await this.userService.getUserByEmail(userEmail);
            if (!user) {
                throw new NotFoundException('404 - (NotFound) No se encontró información');
            } else {
                const userUpdated = await this.userService.recoverPassword(userEmail)
                if (!userUpdated) throw new NotFoundException('404 - (NotFound) No se encontró información');
                return res.status(HttpStatus.OK).json({
                    message: '200 - Email enviado',
                    user: userUpdated
                });
            }
            
        }
    }

    @Put('/favorito/:userEmail')
    async createFavorite(@Res() res, @Param('userEmail') userEmail, @Body() postData: { idReceta: string; nameReceta: string; image: string; createdAt: string} ) {
        const userUpdated = await this.userService.createFavorite(userEmail, postData);
        if (!userUpdated) throw new NotFoundException('404 - (NotFound) No se encontró información.');
        return res.status(HttpStatus.OK).json({
            message: '200 - (Created) Favorito creado.',
            userUpdated: userUpdated
        });
    }

    @Delete('/favorito/:userEmail')
    async deleteFavorite(@Res() res, @Param('userEmail') userEmail, @Body() postData: { idReceta: string} ) {
        const userUpdated = await this.userService.deleteFavorite(userEmail, postData);
        if (!userUpdated) throw new NotFoundException('404 - (NotFound) No se encontró información.');
        return res.status(HttpStatus.OK).json({
            message: '200 - (Created) Usuario actualizado.',
            userUpdated: userUpdated
        });
    }

    @Put('/nuevaReceta/:userEmail')
    async createRecipe(@Res() res, @Param('userEmail') userEmail, @Body() postData: { idReceta: string; nameReceta: string; image: string; createdAt: string} ) {
        const userUpdated = await this.userService.createRecipe(userEmail, postData);
        if (!userUpdated) throw new NotFoundException('400 - (Bad Request) Los datos enviados son incorrectos o hay datos obligatorios no enviados.');
        return res.status(HttpStatus.OK).json({
            message: '200 - (Created) Usuario actualizado.',
            userUpdated: userUpdated
        });
    }

    @Delete('/borrarReceta/:userEmail')
    async deleteRecipe(@Res() res, @Param('userEmail') userEmail, @Body() postData: { idReceta: string} ) {
        const userUpdated = await this.userService.deleteRecipe(userEmail, postData);
        if (!userUpdated) throw new NotFoundException('400 - (Bad Request) Los datos enviados son incorrectos o hay datos obligatorios no enviados.');
        return res.status(HttpStatus.OK).json({
            message: '200 - (Created) Usuario actualizado.',
            userUpdated: userUpdated
        });
    }
}

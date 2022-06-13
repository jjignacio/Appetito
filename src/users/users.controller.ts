import { Controller, Get, Post, Put, Delete, Res, HttpStatus, Body, Param, NotFoundException } from '@nestjs/common';
import { createUserDTO } from './dto/users.dto';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) {}

    @Post('/create')
    async createPost(@Res() res, @Body() createUserDTO: createUserDTO) {
        //console.log(createUserDTO);
        const user = await this.userService.createUser(createUserDTO)
        return res.status(HttpStatus.OK).json({
            message: 'received',
            user: user
        });
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
        const userUpdated = await this.userService.updateUser(userId, createUserDTO);
        if (!userUpdated) throw new NotFoundException('El usuario no existe');
        return res.status(HttpStatus.OK).json({
            message: 'Usuario actualizado correctamente',
            userUpdated: userUpdated
        });
    }

    @Post('/login')
    async loginPost(@Res() res, @Body() createUserDTO: createUserDTO) {
        //console.log(createUserDTO);
        const user = await this.userService.getUserByMail(createUserDTO)
        if (!user) throw new NotFoundException('Login incorrecto');
        return res.status(HttpStatus.OK).json({
            message: 'received',
            user: user
        });
    }
}

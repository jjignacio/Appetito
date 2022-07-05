import { Controller, Get, Post, Put, Delete, Res, HttpStatus, Body, Param, NotFoundException, Req, } from '@nestjs/common';
import { query } from 'express';
import { get } from 'http';
import { CreateRecetasDTO } from "./dto/recetas.dto";
import { RecetasService } from "./recetas.service";
import { Query } from '@nestjs/common';


@Controller('api/recetas')
export class RecetasController {

    constructor(private recetaService: RecetasService) {}

    @Get('/')
    async getRecetas(@Res() res,)  {
        const recetas = await this.recetaService.getRecetas();
        if (recetas.length == 0) throw new NotFoundException('(NotFound) No se encontró información.');
        return res.status(HttpStatus.OK).json({
            Message: "200 - (Ok) Todo correcto.",
            recetas
        });
    }

   @Get('/:Id')
    async getReceta(@Res() res, @Param('Id') Id) {
        const receta = await this.recetaService.getReceta(Id);
        if (!receta ) throw new NotFoundException('Receta inexistente')
        return res.status(HttpStatus.OK).json({
            Message: "200 - (Ok) Todo correcto.",
            receta
        });
    }

    @Get('/porNombre/:nombreReceta')
    async getRecetasporNombre(@Res() res, @Param('nombreReceta') nombreReceta) {
        const recetas = await this.recetaService.getRecetasporNombre(nombreReceta);
        if (recetas.length == 0) throw new NotFoundException('404 - (NotFound) No se encontró información');
        return res.status(HttpStatus.OK).json({
            message: '200 - (Ok) Todo correcto.',
            recetas: recetas
        });
    }

    @Get('/porUsuario/:nombreUsuario')
    async getRecetasporUsuario(@Res() res, @Param('nombreUsuario') nombreUsuario) {
        const recetas = await this.recetaService.getRecetasporUsuario(nombreUsuario);
        if (recetas.length == 0) throw new NotFoundException('404 - (NotFound) No se encontró información');
        return res.status(HttpStatus.OK).json({
            Message: '200 - (Ok) Todo correcto.',
            recetas
        });
    }
    
    @Get('/porTipo/:tipo')
    async getRecetasporTipo(@Res() res, @Param('tipo') tipo) {
        const recetas = await this.recetaService.getRecetasporTipo(tipo);
        if (recetas.length == 0) throw new NotFoundException('404 - (NotFound) No se encontró información');
        return res.status(HttpStatus.OK).json({
            Message: '200 - (Ok) Todo correcto.',
            recetas
        });
    }

    @Get('/porIngrediente/:ingrediente')
    async getRecetasporIngrediente(@Res() res, @Param('ingrediente') ingrediente) {
        const recetas = await this.recetaService.getRecetasporIngrediente(ingrediente);
        if (recetas.length == 0) throw new NotFoundException('404 - (NotFound) No se encontró información');
        return res.status(HttpStatus.OK).json({
            Message: '200 - (Ok) Todo correcto.',
            recetas
        });
    } 
    
    @Get('/porNoIngrediente/:ingrediente')              
    async getRecetasporNoIngrediente(@Res() res, @Param('ingrediente') ingrediente) {
        const recetas = await this.recetaService.getRecetasporNoIngrediente(ingrediente);
        if (recetas.length == 0) throw new NotFoundException('404 - (NotFound) No se encontró información');
        return res.status(HttpStatus.OK).json({
            Message: '200 - (Ok) Todo correcto.',
            recetas
        });
    }   
      
    @Post('/')
    async createPost(@Res() res, @Body() createRecetasDTO: CreateRecetasDTO ) {
        const receta = await this.recetaService.createReceta(createRecetasDTO)
        if (!receta ) throw new NotFoundException('Receta inexistente');
        return res.status(HttpStatus.OK).json({
            Message: "200 - (Created) Receta creada.",
            receta
        });
    }

    @Delete('/:Id')
    async deteleReceta(@Res() res, @Param('Id') Id) {
        const recetaEliminada =  await this.recetaService.deleteReceta(Id);
        if (!recetaEliminada ) throw new NotFoundException('Receta inexistente')
        return res.status(HttpStatus.OK).json({
            Message: "Receta eliminada satisfactoriamente",
            recetaEliminada
        });
    }

    @Put('/:Id')
    async updateReceta(@Res() res, @Param('Id') Id, @Body() createRecetasDTO: CreateRecetasDTO ) {
        const updateReceta = await this.recetaService.updateReceta(Id, createRecetasDTO);
        if (!updateReceta) throw new NotFoundException('La receta no existe');
        return res.status(HttpStatus.OK).json({
            message: 'Receta actualizada correctamente',
            updateReceta
        });
    }

    @Put('/replace/:Id')
    async replaceReceta(@Res() res, @Param('Id') Id, @Body() createRecetasDTO: CreateRecetasDTO ) {
        const updateReceta = await this.recetaService.replaceReceta(Id, createRecetasDTO);
        if (!updateReceta) throw new NotFoundException('La receta no existe');
        return res.status(HttpStatus.OK).json({
            message: 'Receta reemplazada correctamente',
            updateReceta
        });
    }

    @Put('/review/:Id')
    async createReview(@Res() res, @Param('Id') Id, @Body() postData: { puntuacion: Number } ) {
        const review = await this.recetaService.createReview(Id, postData);
        if (!review) throw new NotFoundException('404 - (NotFound) No se encontró información.');
        return res.status(HttpStatus.OK).json({
            message: '200 - (Created) Reseña creada.',
            review: review
        });
    }
}
 
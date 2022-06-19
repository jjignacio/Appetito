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
        if (recetas.length == 0) throw new NotFoundException('204 - (No Content) Respuesta vacía.');
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
            Message: "Ok, muestra una receta determinda",
            receta
        });
    }

    @Get('/porNombre/:nombreReceta')
    async getRecetaporNombre(@Res() res, @Param('nombreReceta') nombreReceta) {
        const receta = await this.recetaService.getRecetasporNombre(nombreReceta);
        if (receta.length == 0) throw new NotFoundException('404 - (NotFound) No se encontró información');
        return res.status(HttpStatus.OK).json({
            message: '200 -  Receta encontrada satisfactoriamente',
            receta: receta
        });
    }

    @Get('/porUsuario/:nombreUsuario')
    
    async getRecetaporUsuario(@Res() res, @Param('nombreUsuario') nombreUsuario) {
        
        const receta = await this.recetaService.getRecetaporUsuario({ nombreUsuario });
        //console.log(nombreUsuario)
        if (!({ nombreUsuario })) throw new NotFoundException('Receta inexistente')
        //console.log(nombreUsuario)
        return res.status(HttpStatus.OK).json({
            Message: "Receta encontrada satisfactoriamente",
            receta
        });
    }
    
    @Get('/porTipo/:tipo')
    async getRecetaporTipo(@Res() res, @Param('tipo') tipo) {
        
        const receta = await this.recetaService.getRecetaporTipo({ tipo });
        //console.log(tipo)
        if (!receta) throw new NotFoundException('Receta inexistente')
        
        return res.status(HttpStatus.OK).json({
            Message: "Receta encontrada satisfactoriamente",
            receta
        });
    }
    @Get('/porIngrediente/:ingrediente')
    async getRecetaporIngrediente(@Res() res, @Param('ingrediente') ingrediente) {
        
        const receta = await this.recetaService.getRecetaporIngrediente({ ingrediente });
        //console.log(ingrediente)
        if (!receta) throw new NotFoundException('Receta inexistente')
        
        return res.status(HttpStatus.OK).json({
            Message: "Receta encontrada satisfactoriamente",
            receta
        });
    } 
    
    @Get('/porNoIngrediente/:ingrediente')
    //Desde el FE, pasar los parametros como un array ["Tomate","Pepino"],
                           
    async getRecetaporNoIngrediente(@Res() res, @Param('ingrediente') ingrediente) {
        
        const receta = await this.recetaService.getRecetaporNoIngrediente({ ingrediente });
        //console.log(ingrediente)
        if (!receta) throw new NotFoundException('Receta inexistente')
        
        return res.status(HttpStatus.OK).json({
            Message: "Receta encontrada satisfactoriamente",
            receta
        });
    }   
      
    @Post('/')
    async createPost(@Res() res, @Body() createRecetasDTO: CreateRecetasDTO ) {
        const receta = await this.recetaService.createReceta(createRecetasDTO)
        return res.status(HttpStatus.OK).json({
            Message: "Receta creada satisfactoriamente",
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
}
 
//Para incorporar los metodos con nuestra DB//
import { ConsoleLogger, NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Recetas} from "./interfaces/recetas.interface";
import { CreateRecetasDTO } from "./dto/recetas.dto";
import { find } from 'rxjs';
import { stringify } from 'querystring';

@Injectable()
export class RecetasService {

    constructor(@InjectModel('Recetas') private recetasModel: Model<Recetas> ) {}

    // Busca recetas todas las recetas existentes. 
    async getRecetas(): Promise <Recetas []> {
        const recetas =  await this.recetasModel.find()
        return recetas;
    }

    // Busca una receta por su Id y que estén validadas. 
    async getReceta(id: string): Promise <Recetas> {
       const receta = await this.recetasModel.findOne({ _id: id, validada: true });
       return receta;
    }

    // Busca recetas por nombre y retorna un arreglo de recetas. Tienen que estár validadas.
    async getRecetasporNombre( nombreReceta: string ): Promise <Recetas []> {
        const recetas = await this.recetasModel.find({ nombreReceta: { $regex: nombreReceta }, validada: true});
        return recetas;
    } 

    // Busca recetas por usuario y retorna un arreglo de recetas ordenas de forma ascendente por nombre del plato. Tienen que estár validadas.
    async getRecetasporUsuario( nombreUsuario: string ): Promise <Recetas []> {
        const recetas = await this.recetasModel.find({ nombreUsuario: { $regex: nombreUsuario }, validada: true}).sort({nombreReceta: 'asc'});
        return recetas;
    } 

    // Busca recetas por tipo y retorna un arreglo de recetas ordenas de forma ascendente por nombre del plato.
    async getRecetasporTipo(tipo: string): Promise <Recetas []> {
        const recetas = await this.recetasModel.find({ tipo: tipo }).sort({nombreReceta: 'asc'});
        return recetas;
    } 

    // Busca recetas por ingrediente y retorna un arreglo de recetas ordenas de forma ascendente por nombre del plato.
    async getRecetasporIngrediente(ingre: string): Promise <Recetas []> {    
        const recetas = await this.recetasModel.find().elemMatch('ingredientes', { ingrediente: { $regex: ingre }}).sort({nombreReceta: 'asc'});
        return recetas;
    }

    // Busca recetas por no ingrediente y retorna un arreglo de recetas ordenas de forma ascendente por nombre del plato.
    async getRecetasporNoIngrediente(ingre: string): Promise <Recetas []> {
        //const recetas = await this.recetasModel.find({ ingrediente: { $ne: ingre } });
        const recetas = await this.recetasModel.find({'ingredientes.ingrediente': { $ne: ingre }}).sort({nombreReceta: 'asc'});
        return recetas;
    } 

    // Crea una nueva receta.
    async createReceta(createRecetasDTO: CreateRecetasDTO): Promise <Recetas> {
        /*const recetas =  await this.recetasModel.findOne( {nombreReceta: createRecetasDTO.nombreReceta} )
        if(!recetas) {
            const receta = new this.recetasModel(createRecetasDTO);
            return await receta.save();
        } else {
            throw new NotFoundException('404 - Receta existente');
        }*/
        const receta = new this.recetasModel(createRecetasDTO);
        return await receta.save();
    }

    // El objeto {new: true} nos va a devolver la nueva receta actualizada.
    async updateReceta(id: string, createRecetasDTO: CreateRecetasDTO): Promise<Recetas> {
        const updateReceta = await this.recetasModel.findByIdAndUpdate({ _id: id }, createRecetasDTO, {new: true});
        return updateReceta;
    }

    // El objeto {new: true} nos va a devolver la nueva receta reeplazada.
    async replaceReceta(id: string, createRecetasDTO: CreateRecetasDTO): Promise<Recetas> {
        const receta = await this.recetasModel.findById(id);
        if (receta) {
            const replaceReceta = await this.recetasModel.findOneAndReplace({ _id: id }, createRecetasDTO, {new: true});
            return replaceReceta;
        }
    }

    async deleteReceta (id: string ): Promise<Recetas> {
        const deleteReceta = await this.recetasModel.findByIdAndDelete(id);
        return deleteReceta;
    }
}

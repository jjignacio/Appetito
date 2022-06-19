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

    // Busca una receta por su Id. 
    async getReceta(id: string): Promise <Recetas> {
       const receta = await this.recetasModel.findById(id);
       return receta;
    }

    // Busca recetas por nombre y retorna un arreglo de recetas. 
    async getRecetasporNombre( nombreReceta: string ): Promise <Recetas []> {
        const recetas = await this.recetasModel.find({ nombreReceta: nombreReceta });
        return recetas;
    } 

    // Busca recetas por usuario y retorna un arreglo de recetas.
    async getRecetasporUsuario( nombreUsuario: string ): Promise <Recetas []> {
        const recetas = await this.recetasModel.find({ nombreUsuario: nombreUsuario });
        return recetas;
    } 

    // Busca recetas por tipo y retorna un arreglo de recetas.
    async getRecetasporTipo(tipo: string): Promise <Recetas []> {
        const recetas = await this.recetasModel.find({ tipo: tipo });
        return recetas;
    } 

    // Busca recetas por ingrediente y retorna un arreglo de recetas.
    async getRecetasporIngrediente(ingrediente: string): Promise <Recetas []> {    
        const recetas = await this.recetasModel.find({ ingrediente: ingrediente });
        return recetas;
    }

    // Busca recetas por no ingrediente y retorna un arreglo de recetas.
    async getRecetasporNoIngrediente(ingre: string): Promise <Recetas []> {
        const recetas = await this.recetasModel.find({ ingrediente: { $ne: ingre } });
        return recetas;
    } 

    async createReceta(createRecetasDTO: CreateRecetasDTO): Promise <Recetas> {
        const recetas =  await this.recetasModel.findOne( {nombreReceta: createRecetasDTO.nombreReceta} )
        if(!recetas) {
            const receta = new this.recetasModel(createRecetasDTO);
            return await receta.save();
        } else {
            throw new NotFoundException('Receta existente');
        }
        /*
        recetas.forEach((r)=>{
            //console.log(r.nombreReceta)
            if (r.nombreReceta==createRecetasDTO.nombreReceta && r.nombreUsuario==createRecetasDTO.nombreUsuario) {
                existe = true;
                //console.log('receta existente')             
            }
        
        })
        if (!existe){
            const receta = new this.recetasModel(createRecetasDTO);
            return await receta.save();
        } else {
            throw new NotFoundException('Receta existente')
        }       
        */ 

    }
    // El objeto {new: true} nos va a devolver la nueva receta actualizada//
    async updateReceta(id: string, createRecetasDTO: CreateRecetasDTO): Promise<Recetas> {
        const updateReceta = await this.recetasModel.findByIdAndUpdate(id, createRecetasDTO, {new: true});
        return updateReceta;
    }

    async deleteReceta (id: string ): Promise<Recetas> {
        const deleteReceta = await this.recetasModel.findByIdAndDelete(id);
        return deleteReceta;
    }
}

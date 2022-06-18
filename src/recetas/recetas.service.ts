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

    async getRecetas(): Promise<Recetas []> {
        const recetas =  await this.recetasModel.find()
        return recetas;

    }

    async getReceta(id: string): Promise <Recetas> {
       const receta = await this.recetasModel.findById(id);
       return receta;

    }
    async getRecetaporNombre({ nombreReceta }: {  nombreReceta: string; }): Promise <Recetas[]> {
        
        
        let receta = await this.getRecetas()
        //console.log(nombreReceta)
        if (nombreReceta){
            
        receta=receta.filter(receta=>receta.nombreReceta===nombreReceta);
     
    }   
        
        return receta;
    } 

    async getRecetaporUsuario({ nombreUsuario }: {  nombreUsuario: string; }): Promise <Recetas[]> {
        
        
        let receta = await this.getRecetas()
        //console.log(nombreUsuario)
        if (nombreUsuario){
            receta=receta.filter(receta=>receta.nombreUsuario===nombreUsuario);
           }   
        
        return receta;
    } 

    async getRecetaporTipo({ tipo }: {  tipo: string; }): Promise <Recetas[]> {
        
        let receta = await this.getRecetas()
        //console.log(nombreUsuario)
        if (tipo){           
            receta=receta.filter(receta=>receta.tipo===tipo);
            }
            return receta;
    
    } 

    async getRecetaporIngrediente(ingrediente): Promise <Recetas[]> {
        
        const receta = await this.recetasModel.find(ingrediente);  
        return receta;
    

}

    
    async getRecetaporNoIngrediente(ingrediente): Promise <Recetas[]> {
        //var existe = false;
        console.log(ingrediente)
        const receta = await this.recetasModel.find({
           ingrediente: { 
                $not: ingrediente}});
        console.log(ingrediente)
        return receta;
    } 

    async createReceta(createRecetasDTO: CreateRecetasDTO): Promise <Recetas> {
        var existe = false;
        const recetas =  await this.recetasModel.find()
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

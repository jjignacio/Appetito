import { Document } from "mongoose";

export interface Recetas extends Document {
    nombreUsuario: string;
    nombreReceta: string;
    titulo: string;
    descripcion: string;
    imagenes: string;
    multimedia: string;
    cantidadPersonas: number;
    duracion: number;
    dificultad: string;
    ingrediente: string[];
    tipo: string;
    resenias: string;
    calificacion: number;
    pasos: string;
    comentario:string;
    createdAt: Date;
    


}
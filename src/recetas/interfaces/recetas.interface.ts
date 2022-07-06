import { Document } from "mongoose";

export interface Recetas extends Document {
    idUsuario: string;
    nombreUsuario: string;
    nombreReceta: string;
    descripcion: string;
    imagen: string;
    cantidadPersonas: number;
    duracion: number;
    dificultad: string;
    tipo: string;
    validada: boolean;
    reviews: [ 
        {
            calificacion: number,
            usuario: string
        } 
    ];
    puntuacion: number;
    pasos: [
        {
            paso: string,
            descripcion: string,
            image: string,
            videoImage: string
        }
    ];
    ingredientes: [
        {
            ingrediente: string,
            cantidad: string,
            unidad: string
        }
    ];
    createdAt: Date;
}
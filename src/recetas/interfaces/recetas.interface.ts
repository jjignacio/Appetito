import { Document } from "mongoose";

export interface Recetas extends Document {
    idUsuario: string;
    nombreUsuario: string;
    nombreReceta: string;
    titulo: string;
    descripcion: string;
    imagenes: string;
    multimedia: string;
    cantidadPersonas: number;
    duracion: number;
    dificultad: string;
    tipo: string;
    validada: boolean;
    reseñas: [ 
        {
            calificacion: number,
            comentario: string,
            fecha: Date 
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
    ]
    createdAt: Date;
}
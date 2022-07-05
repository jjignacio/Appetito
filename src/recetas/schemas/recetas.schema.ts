// Defineremos que es lo que vamos a guardar dentro de mondodb//
import { Schema } from "mongoose";

export const RecetasSchema = new Schema ({
    idUsuario: String,
    nombreUsuario: String,
    nombreReceta: String,
    descripcion: String,
    imagen: String,
    cantidadPersonas: Number,
    duracion: Number,
    dificultad: String,
    tipo: String,
    validada: Boolean,
    reviews: [{
            calificacion: Number,
            comentario: String,
            fecha: {
                type: Date,
                default: Date.now
            } 
    }],
    puntuacion: Number,
    pasos: [{
            paso: String,
            descripcion: String,
            image: String,
            videoImage: String
    }],
    ingredientes: [{
        ingrediente: String,
        cantidad: String,
        unidad: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
        }
    });
// Defineremos que es lo que vamos a guardar dentro de mondodb//

import { Schema } from "mongoose";


export const RecetasSchema = new Schema ({
    
    nombreUsuario: String,
    nombreReceta: String,
    titulo: String,
    descripcion: String,
    imagenes: String,
    multimedia: String,
    cantidadPersonas: Number,
    duracion: Number,
    dificultad: String,
    ingrediente: [String],
    tipo: String,
    resenias: String,
    calificacion: Number,
    comentario:String,
    pasos: String,    
    createdAt: {
        type: Date,
        default: Date.now
        }
    
    }
    
    );
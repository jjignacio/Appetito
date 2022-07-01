// Se define lo que se manda entre el cliente y servidor//

export class CreateRecetasDTO {
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
    ];
    createdAt: Date;
}
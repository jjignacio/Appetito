// Se define lo que se manda entre el cliente y servidor//

export class CreateRecetasDTO {
    
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
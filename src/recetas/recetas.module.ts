import { Module } from '@nestjs/common';
import { RecetasController } from './recetas.controller';
import { RecetasService } from './recetas.service';
import { MongooseModule } from "@nestjs/mongoose";
import { RecetasSchema } from "./schemas/recetas.schema";


@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'Recetas', schema: RecetasSchema}
    ])


  ],
  controllers: [RecetasController],
  providers: [RecetasService]
})
export class RecetasModule {}


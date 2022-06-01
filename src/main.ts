import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Cors
  app.enableCors();
  
  // Local
  //await app.listen(3000);

  // Prod (Heroku) - si existe la variable de entorno PORT, la va a usar, si no, utiliza el puerto 3000.
  await app.listen(process.env.Port || 3000); 

}
bootstrap();

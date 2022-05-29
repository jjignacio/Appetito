import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Cors
  app.enableCors();
  
  // Local
  //await app.listen(3000);

  // Prod
  
  await app.listen(process.env.PORT || 3000);
}
bootstrap();

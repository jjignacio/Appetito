import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from './users/users.module';

@Module({
  //imports: [MongooseModule.forRoot('mongodb://localhost/nest-appetito'), UsersModule],
  imports: [MongooseModule.forRoot('mongodb+srv://appetito:3LD44rq5b91UuQ2c@cluster0.9bfr6jt.mongodb.net/?retryWrites=true&w=majority'), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

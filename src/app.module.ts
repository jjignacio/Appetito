import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from './users/users.module';
import { LoginModule } from './login/login.module';

@Module({
  //imports: [MongooseModule.forRoot('mongodb://localhost/nest-appetito'), UsersModule],
  imports: [MongooseModule.forRoot('mongodb+srv://appetito:3LD44rq5b91UuQ2c@cluster0.9bfr6jt.mongodb.net/?retryWrites=true&w=majority'), UsersModule, LoginModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

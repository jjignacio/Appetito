import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from './users/users.module';
import { RecetasModule } from './recetas/recetas.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  //imports: [MongooseModule.forRoot('mongodb://localhost/nest-appetito'), UsersModule],
  imports: [
    MongooseModule.forRoot('mongodb+srv://appetito:3LD44rq5b91UuQ2c@cluster0.9bfr6jt.mongodb.net/?retryWrites=true&w=majority'), 
    UsersModule, 
    RecetasModule,
    MailerModule.forRoot({
      //transport: 'smtps://marquezjuan2211@gmail.com:bcoavzgrbfmdnthm@smtp.gmail.com',
      transport: 'smtps://appetito.uade@gmail.com:ecbbjnpbzpscawjl@smtp.gmail.com',
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

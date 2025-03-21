import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { UserLocationsModule } from './user-locations/user-locations.module';

@Module({
  imports: [PrismaModule, UsersModule, UserLocationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { UserLocationsService } from './user-locations.service';
import { UserLocationsController } from './user-locations.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [UserLocationsController],
  providers: [UserLocationsService],
    imports: [PrismaModule],
})
export class UserLocationsModule {}

import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UserLocationsService } from './user-locations.service';
import { Request } from 'express';
import { TrackLocationDto } from './dto';

@Controller('user-locations')
export class UserLocationsController {
  constructor(private readonly userLocationsService: UserLocationsService) {}

  @Post('track/:userId')
  async trackUserLocation(@Param('userId') userId: string, @Req() req: Request) {
    const dto = new TrackLocationDto();
    dto.userId = Number(userId);
    return this.userLocationsService.trackUserLocation(dto, req);
  }

  @Get()
  async getAllUserLocations() {
    return this.userLocationsService.getAllUserLocations();
  }
}

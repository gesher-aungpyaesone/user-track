import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { Request } from 'express';
// import geoip from 'geoip-lite';
import { TrackLocationDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserLocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async trackUserLocation(dto: TrackLocationDto, req: Request) {
    const geoip = require('geoip-lite');
    // const ip = req.ip || req.connection.remoteAddress;
    const ip = '153.166.57.246';
    console.log(geoip);

    const geo = geoip.lookup(ip);
    if (geo) {
      const point = `POINT(${geo.ll[1]} ${geo.ll[0]})`;

      await this.prisma.$executeRaw(Prisma.sql`
            INSERT INTO location ("userId", "latitude", "longitude", "coordinates") 
            VALUES (${dto.userId}, ${geo.ll[0]}, ${geo.ll[1]}, ST_GeomFromText(${point}, 4326));
          `);
      return { success: true };
    }
    return null;
  }

  async getAllUserLocations() {
    const user_locations = await this.prisma.$queryRaw(Prisma.sql`
      SELECT 
          u.id AS user_id,
          u.email,
          u.name AS user_name,
          jsonb_agg(
              jsonb_build_object(
                  'latitude', l.latitude,
                  'longitude', l.longitude,
                  'country_id', c.id,
                  'country_name', c.name,
                  'created_at', l.created_at
              ) ORDER BY l.created_at DESC
          ) AS locations
      FROM 
          "user" u
      JOIN 
          "location" l ON u.id = l."userId"
      JOIN 
          "country" c ON ST_Within(l.coordinates, c.coordinates)
      GROUP BY 
          u.id, u.email, u.name;
    `);
    return { user_locations };
  }
}

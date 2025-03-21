import { Injectable } from '@nestjs/common';
import * as COUNTRIES from '../mapdata/countries.geo.json';
import { PrismaService } from './prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async importCountries() {
    for (let index = 0; index < COUNTRIES.features.length; index++) {
      const country = COUNTRIES.features[index];
      await this.prisma.$executeRaw(Prisma.sql`
        INSERT INTO "country" ("name", "coordinates")
        VALUES (
            ${country.properties.name},
            ST_GeomFromGeoJSON(
                ${country.geometry}
            )
        )
      `);
    }
    return { success: true };
  }
}

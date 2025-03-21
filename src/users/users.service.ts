import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async createUser(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: { email: dto.email, name: dto.name },
    });
  }

  async getUser(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { locations: true },
    });
  }
}

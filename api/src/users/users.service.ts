import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService){}

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    const isEmailTaken = await this.prismaService.user.findUnique({
      where: { email }
    })

    if(isEmailTaken) {
      throw new ConflictException("This email is already in use.");
    }

    const hashedPassword = await hash(password, 12);

    const user = await this.prismaService.user.create({
      data: { name, email, password: hashedPassword }
    });

    return user;
  }

}

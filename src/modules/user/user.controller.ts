import {
  Controller,
  Get,
  UseGuards,
  Put,
  Body,
  ValidationPipe,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/db/entities/user.entity';
import { User } from '../auth/user.decorator';
import { UpdateUserDTO } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private userServide: UserService) {}

  @Get()
  @UseGuards(AuthGuard())
  async findCurrentUser(
    @User() { username }: UserEntity,
  ): Promise<{ user: UserEntity }> {
    const user = await this.userServide.findByUsername(username);
    if (user) {
      return { user };
    } else throw new NotFoundException();
  }

  @Put()
  @UseGuards(AuthGuard())
  async update(
    @User() { username }: UserEntity,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: UpdateUserDTO,
  ): Promise<{ user: UserEntity }> {
    const user = await this.userServide.updateUser(username, data);
    if (user) {
      return { user };
    } else throw new InternalServerErrorException();
  }
}

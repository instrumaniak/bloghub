import {
  Controller,
  Get,
  UseGuards,
  Put,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/entities/user.entity';
import { User } from 'src/auth/user.decorator';
import { UpdateUserDTO } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private userServide: UserService) {}

  @Get()
  @UseGuards(AuthGuard())
  findCurrentUser(@User() { username }: UserEntity): Promise<UserEntity> {
    return this.userServide.findByUsername(username);
  }

  @Put()
  @UseGuards(AuthGuard())
  update(
    @User() { username }: UserEntity,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    data: UpdateUserDTO,
  ): Promise<UserEntity> {
    return this.userServide.updateUser(username, data);
  }
}

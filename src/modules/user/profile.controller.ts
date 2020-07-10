import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from 'src/db/entities/user.entity';

@Controller('profiles')
export class ProfileController {
  constructor(private userService: UserService) {}

  @Get('/:username')
  async findProfile(
    @Param('username') username: string,
  ): Promise<{ profile: UserEntity }> {
    const user = await this.userService.findByUsername(username);
    if (user) {
      return { profile: user };
    } else throw new NotFoundException();
  }
}

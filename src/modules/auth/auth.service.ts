import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO, RegisterDTO } from '../user/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async register(credentials: RegisterDTO): Promise<any> {
    try {
      const user = this.userRepo.create(credentials);
      await user.save();
      const payload = { username: user.username };
      const token = this.jwtService.sign(payload);
      return {
        user: { ...user.toJSON(), token },
      };
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Username has already been taken');
      }
      throw new InternalServerErrorException();
    }
  }

  async login({ email, password }: LoginDTO): Promise<any> {
    try {
      const user = await this.userRepo.findOne({ where: { email } });
      if (user) {
        const hasValidPassword = await user.comparePassword(password);

        if (hasValidPassword) {
          const payload = { username: user.username };
          const token = this.jwtService.sign(payload);
          return {
            user: { ...user.toJSON(), token },
          };
        } else {
          throw new UnauthorizedException('Invalid user password.');
        }
      } else {
        throw new UnauthorizedException('Invalid user email.');
      }
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}

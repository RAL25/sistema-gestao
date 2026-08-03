import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthResponseDto } from './auth.dto';
import { compareSync as bcryptCompareSync } from 'bcrypt';

@Injectable()
export class AuthService {
  private jwtExpirationTimeInSeconds: number;

  constructor(
    private readonly usersService: UsuarioService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtExpirationTimeInSeconds = Number(
      Number(this.configService.get<number>('JWT_EXPIRATION_TIME')),
    );
  }

  async signIn(email: string, password: string): Promise<AuthResponseDto> {
    const foundUser = await this.usersService.findByEmail(email);
    if (!foundUser || !bcryptCompareSync(password, foundUser.senhaHash)) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: foundUser.id,
      email: foundUser.email,
      role: foundUser.cargo,
    };
    const token = this.jwtService.sign(payload);
    return { token, expiresIn: this.jwtExpirationTimeInSeconds };
  }
}

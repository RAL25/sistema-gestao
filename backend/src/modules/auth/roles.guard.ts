import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './roles.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    // 1. Lê quais roles são necessárias para acessar a rota atual
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Se a rota não tiver nenhum decorator @Roles, ela é pública para qualquer logado
    if (!requiredRoles) {
      return true;
    }

    // 2. Pega o usuário que o seu AuthGuard colocou na requisição
    const { user } = context.switchToHttp().getRequest();

    // 3. Verifica se o tipo do usuário está na lista de roles permitidas
    // console.log(user.role);
    return requiredRoles.includes(user?.role);
    // return false;
  }
}

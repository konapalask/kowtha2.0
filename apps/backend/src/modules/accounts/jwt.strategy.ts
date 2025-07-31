import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccountsService } from './accounts.service';
import { getUserWithDepartmentRoles } from '../common/types/request.types';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private accountsService: AccountsService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    const userRoles = await getUserWithDepartmentRoles(this.prisma, payload.id);

    return {
      id: userRoles.id,
      mobile: userRoles.mobile,
      role: userRoles.departmentRoles,
      officeId: userRoles.officeId,
      departmentRoles: userRoles.departmentRoles
    };
  }
} 
import { Tenant, TenantId } from '../types';
import { mockTenants } from '../mock/demoData';

export interface UserSession {
  userId: string;
  name: string;
  email: string;
  role: string;
  mfaVerified: boolean;
  activeTenantId: TenantId;
  portalType?: 'bank' | 'company';
}

const DEFAULT_SESSION: UserSession = {
  userId: 'usr-9012',
  name: 'Alex Morgan',
  email: 'alex.morgan@apexcapital.com',
  role: 'Managing Risk Officer',
  mfaVerified: true,
  activeTenantId: 'tenant-a',
  portalType: 'bank'
};

class AuthService {
  private session: UserSession = { ...DEFAULT_SESSION };

  public getSession(): UserSession {
    return { ...this.session };
  }

  public getTenants(): Tenant[] {
    return mockTenants;
  }

  public getActiveTenant(): Tenant {
    return mockTenants.find(t => t.id === this.session.activeTenantId) || mockTenants[0];
  }

  public login(portalType: 'bank' | 'company', tenantId: TenantId, email?: string, name?: string, role?: string): UserSession {
    this.session = {
      userId: portalType === 'bank' ? 'usr-9012' : 'usr-corp-8821',
      name: name || (portalType === 'bank' ? 'Alex Morgan' : 'Sarah Jenkins'),
      email: email || (portalType === 'bank' ? 'alex.morgan@apexcapital.com' : 'treasury@acmecomponents.com'),
      role: role || (portalType === 'bank' ? 'Managing Risk Officer' : 'Corporate Finance Lead'),
      mfaVerified: true,
      activeTenantId: tenantId,
      portalType
    };
    return { ...this.session };
  }

  public switchTenant(tenantId: TenantId): UserSession {
    this.session.activeTenantId = tenantId;
    return { ...this.session };
  }

  public toggleMFA(status: boolean): UserSession {
    this.session.mfaVerified = status;
    return { ...this.session };
  }

  /**
   * Tenant Authorization Guard (Security Rule 17)
   * Prevents IDOR / cross-tenant data access.
   */
  public canAccessCase(caseTenantId: TenantId): boolean {
    return this.session.activeTenantId === caseTenantId;
  }
}

export const authService = new AuthService();

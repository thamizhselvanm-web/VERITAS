import React from 'react';
import { Search, Bell } from 'lucide-react';
import { Tenant, TenantId } from '../../types';
import { UserSession } from '../../services/authService';

interface TopCommandBarProps {
  session: UserSession;
  tenants: Tenant[];
  onSwitchTenant: (tenantId: TenantId) => void;
  onOpenSearch: () => void;
}

export const TopCommandBar: React.FC<TopCommandBarProps> = ({
  session,
  tenants,
  onSwitchTenant,
  onOpenSearch
}) => {
  const activeTenant = tenants.find(t => t.id === session.activeTenantId) || tenants[0];

  return (
    <header className="topbar">
      <button className="tenant-select" onClick={() => {
        const nextTenant = session.activeTenantId === 'tenant-a' ? 'tenant-b' : 'tenant-a';
        onSwitchTenant(nextTenant);
      }}>
        <span>{activeTenant.name}</span>
        <span className="sub">({activeTenant.code})</span>
      </button>

      <div className="search" onClick={onOpenSearch}>
        <Search width="14" height="14" />
        <span>Search cases, invoices, entities…</span>
        <kbd>⌘K</kbd>
      </div>

      <div className="top-actions">
        <span className="live-pill">
          VERITAS TRUST OPERATIONS
        </span>

        <button className="icon-btn" title="Notifications" onClick={onOpenSearch}>
          <Bell width="18" height="18" />
        </button>

        <div className="avatar">
          <span className="chip">AM</span>
          <span className="who">
            <strong>{session.name}</strong>
            <span>{session.role}</span>
          </span>
        </div>
      </div>
    </header>
  );
};

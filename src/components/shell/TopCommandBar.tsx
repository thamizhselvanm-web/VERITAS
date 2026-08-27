import React from 'react';
import { Search, Bell, Menu, Shield } from 'lucide-react';
import { Tenant, TenantId } from '../../types';
import { UserSession } from '../../services/authService';

interface TopCommandBarProps {
  session: UserSession;
  tenants: Tenant[];
  onSwitchTenant: (tenantId: TenantId) => void;
  onOpenSearch: () => void;
  onToggleMobileMenu?: () => void;
}

export const TopCommandBar: React.FC<TopCommandBarProps> = ({
  session,
  tenants,
  onSwitchTenant,
  onOpenSearch,
  onToggleMobileMenu
}) => {
  const activeTenant = tenants.find(t => t.id === session.activeTenantId) || tenants[0];

  return (
    <header className="topbar flex items-center justify-between px-4 sm:px-6 py-2.5">
      
      {/* Mobile Menu Trigger & Brand Identity */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-xl bg-[#231E1B] border border-[#E07A5F]/30 text-[#E07A5F] hover:bg-[#E07A5F]/20 transition-colors"
          aria-label="Open mobile navigation menu"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button 
          className="tenant-select" 
          onClick={() => {
            const nextTenant = session.activeTenantId === 'tenant-a' ? 'tenant-b' : 'tenant-a';
            onSwitchTenant(nextTenant);
          }}
          title="Click to switch active workspace tenant"
          aria-label={`Active Tenant: ${activeTenant.name}. Click to switch.`}
        >
          <span className="truncate max-w-[140px] sm:max-w-none">{activeTenant.name}</span>
          <span className="sub">({activeTenant.code})</span>
        </button>
      </div>

      {/* Global Command Search Box */}
      <div 
        className="search cursor-pointer" 
        onClick={onOpenSearch}
        role="button"
        tabIndex={0}
        aria-label="Search cases, invoices, entities"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpenSearch(); }}
      >
        <Search className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="truncate">Search cases, invoices, entities…</span>
        <kbd className="hidden sm:inline-block">⌘K</kbd>
      </div>

      {/* Actions & Avatar */}
      <div className="top-actions flex items-center gap-3">
        <span className="live-pill hidden xl:inline-flex">
          <Shield className="w-3.5 h-3.5 text-[#52B788]" />
          VERITAS TRUST OPERATIONS
        </span>

        <button 
          className="icon-btn" 
          title="Notifications & Search" 
          onClick={onOpenSearch}
          aria-label="Open Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="dot" />
        </button>

        <a
          href={`mailto:${session.email}`}
          className="avatar hover:opacity-90 transition-opacity"
          title={`Click to send email to ${session.email}`}
          aria-label={`User profile for ${session.name}, email ${session.email}`}
        >
          <span className="chip">AM</span>
          <span className="who hidden sm:block">
            <strong>{session.name}</strong>
            <span>{session.role}</span>
          </span>
        </a>
      </div>

    </header>
  );
};


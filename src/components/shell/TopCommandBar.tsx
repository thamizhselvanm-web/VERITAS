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
    <header className="topbar flex items-center justify-between px-4 sm:px-6 py-2.5 bg-[#1C1917] border-b border-[#2E2A27]">
      
      {/* Mobile Menu Trigger & Brand Identity */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-xl bg-[#262320] border border-[#2E2A27] text-[#6366F1] hover:bg-[#6366F1]/15 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#6366F1]"
          aria-label="Open mobile navigation menu"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button 
          className="tenant-select bg-[#262320] border border-[#2E2A27] hover:border-[#6366F1] text-[#F7F4F1] transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#6366F1]" 
          onClick={() => {
            const nextTenant = session.activeTenantId === 'tenant-a' ? 'tenant-b' : 'tenant-a';
            onSwitchTenant(nextTenant);
          }}
          title="Click to switch active workspace tenant"
          aria-label={`Active Tenant: ${activeTenant.name}. Click to switch.`}
        >
          <span className="truncate max-w-[140px] sm:max-w-none font-semibold">{activeTenant.name}</span>
          <span className="sub text-[#6366F1] font-mono ml-1">({activeTenant.code})</span>
        </button>
      </div>

      {/* Global Interactive Command Search Input Bar */}
      <div 
        onClick={onOpenSearch}
        className="search cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141211] border border-[#2E2A27] hover:border-[#6366F1] text-[#9E8C7C] transition-all duration-150 flex-1 max-w-sm sm:max-w-md mx-3 focus-within:ring-2 focus-within:ring-[#6366F1]"
        role="button"
        tabIndex={0}
        aria-label="Global search command palette"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenSearch();
          }
        }}
      >
        <Search className="w-3.5 h-3.5 flex-shrink-0 text-[#6366F1]" />
        <input
          type="text"
          readOnly
          placeholder="Search cases, invoices, entities… (⌘K)"
          className="bg-transparent border-0 outline-none w-full text-xs text-[#F7F4F1] placeholder-[#9E8C7C] cursor-pointer"
        />
        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#262320] border border-[#2E2A27] text-[#D8C7B8]">
          ⌘K
        </kbd>
      </div>

      {/* Actions & User Avatar */}
      <div className="top-actions flex items-center gap-3">
        <span className="live-pill hidden xl:inline-flex bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] font-mono text-xs px-3 py-1 rounded-full">
          <Shield className="w-3.5 h-3.5 text-[#10B981]" />
          VERITAS TRUST OPERATIONS
        </span>

        <button 
          className="icon-btn p-2 rounded-xl bg-[#262320] border border-[#2E2A27] text-[#D8C7B8] hover:text-[#F7F4F1] hover:border-[#6366F1] transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#6366F1]" 
          title="Notifications & Search" 
          onClick={onOpenSearch}
          aria-label="Open Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>

        <a
          href={`mailto:${session.email}`}
          className="avatar flex items-center gap-2.5 hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-[#6366F1] rounded-lg p-1"
          title={`Click to send email to ${session.email}`}
          aria-label={`User profile for ${session.name}, email ${session.email}`}
        >
          <span className="chip w-8 h-8 rounded-full bg-[#4F46E5] text-white font-bold text-xs flex items-center justify-center shadow-md">
            AM
          </span>
          <span className="who hidden sm:block">
            <strong className="text-xs text-[#F7F4F1] font-semibold">{session.name}</strong>
            <span className="text-[11px] text-[#9E8C7C] font-mono">{session.role}</span>
          </span>
        </a>
      </div>

    </header>
  );
};

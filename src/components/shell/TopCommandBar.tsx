import React from 'react';
import { Search, Bell, Radio, Users, Command } from 'lucide-react';
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
  return (
    <header className="sticky top-0 z-30 w-full bg-[#1C1816]/90 backdrop-blur-xl border-b border-[#E07A5F]/20 px-8 py-3 font-sans select-none">
      <div className="max-w-[1760px] mx-auto flex items-center justify-between gap-6">
        
        {/* Left: Tenant Workspace Selector */}
        <div className="flex items-center gap-3 bg-[#141211] border border-[#E07A5F]/20 px-3.5 py-1.5 rounded-lg text-xs">
          <Users className="w-4 h-4 text-[#E07A5F]" />
          <span className="text-[#D8C7B8] font-medium">Workspace:</span>
          <select
            value={session.activeTenantId}
            onChange={(e) => onSwitchTenant(e.target.value as TenantId)}
            className="bg-transparent text-[#F7F4F1] font-bold text-xs focus:outline-none cursor-pointer border-none pr-1"
          >
            {tenants.map((t) => (
              <option key={t.id} value={t.id} className="bg-[#1C1816] text-[#F7F4F1]">
                {t.name.toUpperCase()} ({t.code})
              </option>
            ))}
          </select>
        </div>

        {/* Center: Global Search Bar Trigger */}
        <div 
          onClick={onOpenSearch}
          className="flex-1 max-w-md relative bg-[#141211] border border-[#E07A5F]/20 hover:border-[#E07A5F]/50 rounded-lg px-3.5 py-2 cursor-pointer transition-all flex items-center justify-between text-xs text-[#D8C7B8]"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-[#9E8C7C]" />
            <span>Search cases, invoices, entities...</span>
          </div>

          <kbd className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] bg-[#231E1B] text-[#D8C7B8] px-2 py-0.5 rounded border border-[#E07A5F]/20">
            <Command className="w-3 h-3 text-[#E07A5F]" /> K
          </kbd>
        </div>

        {/* Right: Live Status & User Profile */}
        <div className="flex items-center gap-4">
          
          {/* VERITAS LIVE Status Badge */}
          <div className="flex items-center gap-2 bg-[#52B788]/15 border border-[#52B788]/35 px-3 py-1.5 rounded-lg text-xs font-mono text-[#52B788]">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#52B788]" />
            <span className="font-bold tracking-wider">VERITAS LIVE</span>
          </div>

          {/* Notifications */}
          <button className="p-2 rounded-lg bg-[#141211] border border-[#E07A5F]/20 text-[#D8C7B8] hover:text-[#F7F4F1] hover:border-[#E07A5F]/40 transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E07A5F]" />
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-[#E07A5F]/20">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#B85235] to-[#E07A5F] flex items-center justify-center text-white font-bold text-xs shadow-md shadow-[#E07A5F]/20">
              AM
            </div>
            <div className="hidden lg:block text-left">
              <span className="text-xs font-bold text-[#F7F4F1] block leading-none">{session.name}</span>
              <span className="text-[10px] text-[#9E8C7C] font-mono mt-0.5 block">{session.role}</span>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};

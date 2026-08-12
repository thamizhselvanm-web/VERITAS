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
    <header className="sticky top-0 z-30 w-full bg-[#05070B]/80 backdrop-blur-xl border-b border-white/10 px-8 py-3 font-sans select-none">
      <div className="max-w-[1760px] mx-auto flex items-center justify-between gap-6">
        
        {/* Left: Tenant Context Selector per Brief Sec 7 */}
        <div className="flex items-center gap-3 bg-[#0B1018] border border-white/10 px-3.5 py-1.5 rounded-lg text-xs">
          <Users className="w-4 h-4 text-[#00F0FF]" />
          <span className="text-[#94A3B8] font-medium">Workspace:</span>
          <select
            value={session.activeTenantId}
            onChange={(e) => onSwitchTenant(e.target.value as TenantId)}
            className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer border-none pr-1"
          >
            {tenants.map((t) => (
              <option key={t.id} value={t.id} className="bg-[#0B1018] text-white">
                {t.name.toUpperCase()} ({t.code})
              </option>
            ))}
          </select>
        </div>

        {/* Center: Global Search Trigger per Brief Sec 7 */}
        <div 
          onClick={onOpenSearch}
          className="flex-1 max-w-md relative bg-[#0B1018] border border-white/10 hover:border-[#00F0FF]/40 rounded-lg px-3.5 py-2 cursor-pointer transition-all flex items-center justify-between text-xs text-[#94A3B8]"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-[#64748B]" />
            <span>Search cases, invoices, entities...</span>
          </div>

          <kbd className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] bg-[#161B22] text-[#94A3B8] px-2 py-0.5 rounded border border-white/10">
            <Command className="w-3 h-3" /> K
          </kbd>
        </div>

        {/* Right: System Status & User Profile per Brief Sec 7 */}
        <div className="flex items-center gap-4">
          
          {/* VERITAS LIVE Badge */}
          <div className="flex items-center gap-2 bg-[#3FB950]/10 border border-[#3FB950]/30 px-3 py-1.5 rounded-lg text-xs font-mono text-[#3FB950]">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-bold tracking-wider">VERITAS LIVE</span>
          </div>

          {/* Notifications Bell */}
          <button className="p-2 rounded-lg bg-[#0B1018] border border-white/10 text-[#94A3B8] hover:text-white transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00F0FF]" />
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              AM
            </div>
            <div className="hidden lg:block text-left">
              <span className="text-xs font-bold text-white block leading-none">{session.name}</span>
              <span className="text-[10px] text-[#94A3B8] font-mono mt-0.5 block">{session.role}</span>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};

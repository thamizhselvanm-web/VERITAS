import React from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  ListFilter, 
  UploadCloud, 
  Network, 
  FileCheck, 
  Radio, 
  Users, 
  ExternalLink,
  Lock,
  LogOut
} from 'lucide-react';
import { Tenant, TenantId } from '../../types';
import { UserSession } from '../../services/authService';

export type PageId = 
  | 'overview' 
  | 'review-queue' 
  | 'upload-pipeline' 
  | 'case-detail' 
  | 'trust-graph' 
  | 'monitoring' 
  | 'audit-proof' 
  | 'public-verify';

interface SidebarProps {
  session: UserSession;
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  tenants: Tenant[];
  onSwitchTenant: (tenantId: TenantId) => void;
  onLogout: () => void;
  selectedCaseNumber: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  session,
  activePage,
  onNavigate,
  tenants,
  onSwitchTenant,
  onLogout,
  selectedCaseNumber
}) => {
  const navItems = [
    { id: 'overview' as PageId, label: 'Overview (Trust Ops)', icon: LayoutDashboard, badge: '12' },
    { id: 'review-queue' as PageId, label: 'Trust Cases', icon: ListFilter, badge: 'Queue' },
    { id: 'upload-pipeline' as PageId, label: 'Invoices / Ingestion', icon: UploadCloud, badge: 'Intent' },
    { id: 'case-detail' as PageId, label: `Case ${selectedCaseNumber}`, icon: Shield, badge: 'Detail' },
    { id: 'trust-graph' as PageId, label: 'Trust Graph', icon: Network, badge: null },
    { id: 'monitoring' as PageId, label: 'Continuous Monitoring', icon: Radio, badge: 'Live' },
    { id: 'audit-proof' as PageId, label: 'Audit & Proof', icon: FileCheck, badge: 'On-Chain' },
    { id: 'public-verify' as PageId, label: 'Public QR Verification', icon: ExternalLink, badge: 'QR' }
  ];

  return (
    <aside className="w-64 bg-[#0D1117] border-r border-[#30363D] min-h-screen flex flex-col justify-between p-4 flex-shrink-0 font-sans">
      
      <div className="space-y-6">
        
        {/* Brand Header */}
        <div 
          onClick={() => onNavigate('overview')}
          className="flex items-center gap-2.5 cursor-pointer px-2 py-1"
        >
          <div className="w-8 h-8 rounded bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
            <Shield className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white tracking-wider font-mono text-sm">VERITAS</span>
              <span className="text-[9px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/30 px-1.5 py-0.2 rounded">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-[#8B949E]">Trust Intelligence Layer</p>
          </div>
        </div>

        {/* Tenant Context Selector */}
        <div className="bg-[#161B22] border border-[#30363D] rounded p-3 space-y-1.5">
          <span className="text-[10px] font-mono font-bold text-[#8B949E] uppercase tracking-wider block">
            Tenant Context
          </span>

          <select
            value={session.activeTenantId}
            onChange={(e) => onSwitchTenant(e.target.value as TenantId)}
            className="w-full bg-[#0D1117] border border-[#30363D] text-white rounded text-xs px-2.5 py-1.5 font-semibold focus:outline-none cursor-pointer"
          >
            {tenants.map((t) => (
              <option key={t.id} value={t.id} className="bg-[#0D1117] text-white">
                {t.name} ({t.code})
              </option>
            ))}
          </select>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          <span className="text-[10px] font-mono font-bold text-[#8B949E] uppercase tracking-widest px-2 block mb-1">
            Information Architecture
          </span>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#21262D] text-white border border-[#484F58]'
                    : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-[#8B949E]'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-blue-500/20 text-blue-300' : 'bg-[#161B22] text-[#8B949E]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

      </div>

      {/* User Session Footer */}
      <div className="pt-4 border-t border-[#30363D] flex items-center justify-between text-xs text-[#8B949E]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-white text-xs">
            AM
          </div>
          <div>
            <p className="text-xs font-bold text-white leading-none">{session.name}</p>
            <span className="text-[9px] text-[#3FB950] font-mono flex items-center gap-1 mt-0.5">
              <Lock className="w-2.5 h-2.5" /> OIDC + MFA
            </span>
          </div>
        </div>

        <button onClick={onLogout} className="hover:text-[#F85149] p-1.5 rounded" title="Sign Out">
          <LogOut className="w-4 h-4" />
        </button>
      </div>

    </aside>
  );
};

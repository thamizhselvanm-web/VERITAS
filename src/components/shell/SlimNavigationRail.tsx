import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  LayoutDashboard, 
  ListFilter, 
  UploadCloud, 
  Network, 
  Radio, 
  FileCheck, 
  ExternalLink, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { PageId } from '../common/Sidebar';

interface SlimNavigationRailProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  onLogout: () => void;
}

export const SlimNavigationRail: React.FC<SlimNavigationRailProps> = ({
  activePage,
  onNavigate,
  onLogout
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const navItems = [
    { id: 'overview' as PageId, label: 'Overview', icon: LayoutDashboard },
    { id: 'review-queue' as PageId, label: 'Trust Cases', icon: ListFilter },
    { id: 'upload-pipeline' as PageId, label: 'Invoices', icon: UploadCloud },
    { id: 'trust-graph' as PageId, label: 'Trust Graph', icon: Network },
    { id: 'monitoring' as PageId, label: 'Continuous Monitoring', icon: Radio },
    { id: 'audit-proof' as PageId, label: 'Audit & Proof', icon: FileCheck },
    { id: 'public-verify' as PageId, label: 'Public Verification', icon: ExternalLink }
  ];

  return (
    <motion.aside
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ width: 72 }}
      animate={{ width: isHovered ? 240 : 72 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 bottom-0 z-40 bg-[#0B1018]/95 backdrop-blur-xl border-r border-white/10 flex flex-col justify-between p-3 select-none shadow-2xl font-sans"
    >
      
      {/* Brand Header */}
      <div className="space-y-6">
        <div 
          onClick={() => onNavigate('overview')}
          className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-[#00F0FF] p-[1px] flex-shrink-0 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#05070B] rounded-[7px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#00F0FF]" />
            </div>
          </div>

          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="whitespace-nowrap overflow-hidden"
            >
              <span className="font-extrabold text-white tracking-wider font-mono text-base block">VERITAS</span>
              <span className="text-[10px] text-[#00F0FF] font-mono tracking-wide">SPATIAL INTEL</span>
            </motion.div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-lg text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'bg-[#1F6FEB]/20 text-[#00F0FF] border border-[#00F0FF]/40 shadow-lg shadow-cyan-500/10'
                    : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                }`}
                title={!isHovered ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#00F0FF]' : 'text-[#94A3B8]'}`} />

                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}

                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#00F0FF] rounded-r" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Footer */}
      <div className="border-t border-white/10 pt-3 space-y-2">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-xs text-[#94A3B8] hover:text-[#F85149] hover:bg-[#F85149]/10 transition-colors"
          title={!isHovered ? 'Sign Out' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isHovered && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-nowrap">
              Sign Out
            </motion.span>
          )}
        </button>
      </div>

    </motion.aside>
  );
};

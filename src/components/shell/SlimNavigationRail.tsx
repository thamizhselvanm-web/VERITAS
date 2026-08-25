import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  LayoutDashboard, 
  ListFilter, 
  UploadCloud, 
  Network, 
  Radio, 
  FileCheck, 
  ExternalLink, 
  LogOut
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
      initial={{ width: 64 }}
      animate={{ width: isHovered ? 240 : 64 }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      className="sidebar fixed top-0 left-0 bottom-0 z-40 bg-[#1C1816]/95 backdrop-blur-xl border-r border-[#E07A5F]/30 flex flex-col justify-between p-3 select-none shadow-2xl font-sans"
      aria-label="Primary Named Navigation"
    >
      {/* Top Section: Brand & Nav Items */}
      <div className="space-y-6 w-full">
        
        {/* Brand Mark */}
        <div 
          onClick={() => onNavigate('overview')}
          className="flex items-center gap-3 cursor-pointer p-1.5 rounded-xl hover:bg-[#E07A5F]/15 transition-colors overflow-hidden"
        >
          <div className="mark flex-shrink-0">V</div>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.18 }}
                className="whitespace-nowrap overflow-hidden"
              >
                <span className="font-sans font-extrabold text-base text-[#F7F4F1] tracking-tight block leading-none">VERITAS</span>
                <span className="text-[9px] text-[#E07A5F] font-mono tracking-widest block mt-1 uppercase">TRUST OPERATIONS</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Named Navigation Items */}
        <nav className="space-y-1.5 w-full" aria-label="Sections">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative overflow-hidden ${
                  isActive
                    ? 'bg-[#E07A5F]/20 text-[#E07A5F] border border-[#E07A5F]/40 shadow-md shadow-[#E07A5F]/15'
                    : 'text-[#9E8C7C] hover:text-[#F7F4F1] hover:bg-[#E07A5F]/10'
                }`}
                title={!isHovered ? item.label : undefined}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#E07A5F]' : 'text-[#9E8C7C]'}`} />

                <AnimatePresence>
                  {isHovered && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.15 }}
                      className="whitespace-nowrap overflow-hidden text-xs font-semibold"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#E07A5F] rounded-r" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Sign Out */}
      <div className="border-t border-[#E07A5F]/20 pt-3 w-full">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-medium text-[#9E8C7C] hover:text-[#F07151] hover:bg-[#F07151]/10 transition-colors overflow-hidden"
          title={!isHovered ? 'Sign Out' : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0 text-[#9E8C7C]" />
          <AnimatePresence>
            {isHovered && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="whitespace-nowrap text-xs font-semibold"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

    </motion.aside>
  );
};

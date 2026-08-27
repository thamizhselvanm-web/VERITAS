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
  LogOut,
  X
} from 'lucide-react';
import { PageId } from '../common/Sidebar';

interface SlimNavigationRailProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onCloseMobileMenu?: () => void;
}

export const SlimNavigationRail: React.FC<SlimNavigationRailProps> = ({
  activePage,
  onNavigate,
  onLogout,
  isMobileOpen = false,
  onCloseMobileMenu
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

  const handleSelect = (pageId: PageId) => {
    onNavigate(pageId);
    if (onCloseMobileMenu) onCloseMobileMenu();
  };

  return (
    <>
      {/* Desktop Fixed Sidebar Navigation Rail (>= 768px) */}
      <motion.aside
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        initial={{ width: 64 }}
        animate={{ width: isHovered ? 240 : 64 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className="sidebar hidden md:flex fixed top-0 left-0 bottom-0 z-40 bg-[#1C1816]/95 backdrop-blur-xl border-r border-[#E07A5F]/30 flex-col justify-between p-3 select-none shadow-2xl font-sans"
        aria-label="Primary Named Navigation"
      >
        {/* Top Section: Brand & Nav Items */}
        <div className="space-y-6 w-full">
          
          {/* Brand Mark */}
          <div 
            onClick={() => handleSelect('overview')}
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
                  onClick={() => handleSelect(item.id)}
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

      {/* Mobile Slide-Over Navigation Drawer (< 768px) */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobileMenu}
              className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm md:hidden"
              aria-hidden="true"
            />

            {/* Mobile Navigation Drawer */}
            <motion.nav
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 32 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#1C1816] border-r border-[#E07A5F]/40 p-5 flex flex-col justify-between md:hidden font-sans shadow-2xl overflow-y-auto"
              aria-label="Mobile Navigation"
            >
              <div className="space-y-6">
                {/* Mobile Drawer Header */}
                <div className="flex items-center justify-between border-b border-[#E07A5F]/20 pb-4">
                  <div 
                    onClick={() => handleSelect('overview')}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#B85235] to-[#E07A5F] flex items-center justify-center font-bold text-white shadow-lg">
                      V
                    </div>
                    <div>
                      <span className="font-bold text-base text-[#F7F4F1] tracking-tight block leading-none">VERITAS</span>
                      <span className="text-[9px] text-[#E07A5F] font-mono tracking-widest block mt-1 uppercase">TRUST OPERATIONS</span>
                    </div>
                  </div>

                  <button
                    onClick={onCloseMobileMenu}
                    className="p-1.5 rounded-lg bg-[#231E1B] text-[#9E8C7C] hover:text-[#F7F4F1]"
                    aria-label="Close mobile navigation"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Navigation Links */}
                <div className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item.id)}
                        className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                          isActive
                            ? 'bg-[#E07A5F]/20 text-[#E07A5F] border border-[#E07A5F]/40 shadow-md'
                            : 'text-[#D8C7B8] hover:text-[#F7F4F1] hover:bg-[#E07A5F]/10'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-[#E07A5F]' : 'text-[#9E8C7C]'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Logout Footer */}
              <div className="border-t border-[#E07A5F]/20 pt-4">
                <button
                  onClick={() => {
                    onLogout();
                    if (onCloseMobileMenu) onCloseMobileMenu();
                  }}
                  className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-[#F07151] hover:bg-[#F07151]/10 transition-colors"
                >
                  <LogOut className="w-5 h-5 text-[#F07151]" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};


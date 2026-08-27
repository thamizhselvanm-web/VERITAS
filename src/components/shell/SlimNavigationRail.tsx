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
    { id: 'overview' as PageId, label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'review-queue' as PageId, label: 'Trust Cases Queue', icon: ListFilter },
    { id: 'upload-pipeline' as PageId, label: 'Invoice Processing', icon: UploadCloud },
    { id: 'trust-graph' as PageId, label: '3D Trust Graph', icon: Network },
    { id: 'monitoring' as PageId, label: 'Continuous Stream', icon: Radio },
    { id: 'audit-proof' as PageId, label: 'Cryptographic Proofs', icon: FileCheck },
    { id: 'public-verify' as PageId, label: 'Public Verifier', icon: ExternalLink }
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
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="sidebar hidden md:flex fixed top-0 left-0 bottom-0 z-40 bg-[#1C1917] border-r border-[#2E2A27] flex-col justify-between p-3 select-none font-sans shadow-xl"
        aria-label="Primary Institutional Navigation"
      >
        {/* Top Section: Brand & Nav Items */}
        <div className="space-y-6 w-full">
          
          {/* Brand Mark */}
          <div 
            onClick={() => handleSelect('overview')}
            className="flex items-center gap-3 cursor-pointer p-1.5 rounded-xl hover:bg-[#262320] transition-all duration-150 overflow-hidden focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:outline-none"
            tabIndex={0}
            role="button"
            aria-label="VERITAS Trust Operations Home"
          >
            <div className="w-8 h-8 rounded-lg bg-[#4F46E5] text-white flex-shrink-0 flex items-center justify-center font-bold text-sm shadow-md">
              V
            </div>

            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  <span className="font-sans font-extrabold text-base text-[#F7F4F1] tracking-tight block leading-none">VERITAS</span>
                  <span className="text-[9px] text-[#6366F1] font-mono tracking-widest block mt-1 uppercase">TRUST OPERATIONS</span>
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
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 relative overflow-hidden focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:outline-none ${
                    isActive
                      ? 'bg-[#6366F1]/15 text-[#6366F1] border border-[#6366F1]/30 font-bold'
                      : 'text-[#9E8C7C] hover:text-[#F7F4F1] hover:bg-[#262320]'
                  }`}
                  title={item.label}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#6366F1]' : 'text-[#9E8C7C]'}`} />

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
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#6366F1] rounded-r" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Sign Out */}
        <div className="border-t border-[#2E2A27] pt-3 w-full">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-medium text-[#9E8C7C] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors duration-150 overflow-hidden focus-visible:ring-2 focus-visible:ring-[#EF4444] focus-visible:outline-none"
            title="Sign Out"
            aria-label="Sign Out"
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
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden"
              aria-hidden="true"
            />

            {/* Mobile Navigation Drawer */}
            <motion.nav
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#1C1917] border-r border-[#2E2A27] p-5 flex flex-col justify-between md:hidden font-sans shadow-2xl overflow-y-auto custom-scrollbar touch-manipulation"
              aria-label="Mobile Primary Navigation"
            >
              <div className="space-y-6">
                {/* Mobile Drawer Header */}
                <div className="flex items-center justify-between border-b border-[#2E2A27] pb-4">
                  <div 
                    onClick={() => handleSelect('overview')}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center font-bold text-base shadow-md">
                      V
                    </div>
                    <div>
                      <span className="font-bold text-base text-[#F7F4F1] tracking-tight block leading-none">VERITAS</span>
                      <span className="text-[9px] text-[#6366F1] font-mono tracking-widest block mt-1 uppercase">TRUST OPERATIONS</span>
                    </div>
                  </div>

                  <button
                    onClick={onCloseMobileMenu}
                    className="p-2 rounded-xl bg-[#262320] border border-[#2E2A27] text-[#9E8C7C] hover:text-[#F7F4F1] active:bg-[#6366F1]/20 focus-visible:ring-2 focus-visible:ring-[#6366F1] min-h-[44px] min-w-[44px] flex items-center justify-center"
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
                        className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-150 min-h-[48px] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#6366F1] ${
                          isActive
                            ? 'bg-[#6366F1]/15 text-[#6366F1] border border-[#6366F1]/30 font-bold'
                            : 'text-[#D8C7B8] hover:text-[#F7F4F1] hover:bg-[#262320] active:bg-[#262320]'
                        }`}
                        title={item.label}
                        aria-label={item.label}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-[#6366F1]' : 'text-[#9E8C7C]'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Logout Footer */}
              <div className="border-t border-[#2E2A27] pt-4">
                <button
                  onClick={() => {
                    onLogout();
                    if (onCloseMobileMenu) onCloseMobileMenu();
                  }}
                  className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold text-[#EF4444] hover:bg-[#EF4444]/10 active:bg-[#EF4444]/20 transition-colors duration-150 min-h-[48px]"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-5 h-5 text-[#EF4444]" />
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

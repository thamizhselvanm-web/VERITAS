import React, { useState } from 'react';
import { Network, AlertCircle, Building2, FileText, Landmark, UserCheck, Eye, Layers } from 'lucide-react';
import { GraphNode, GraphEdge } from '../../types';

interface TrustGraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  caseNumber: string;
}

export const TrustGraphCanvas: React.FC<TrustGraphCanvasProps> = ({ nodes, edges, caseNumber }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(nodes[0]?.id || null);
  const [showSuspiciousOnly, setShowSuspiciousOnly] = useState<boolean>(false);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const displayedEdges = showSuspiciousOnly ? edges.filter(e => e.isSuspicious) : edges;

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'SELLER': return <Building2 className="w-5 h-5 text-blue-400" />;
      case 'BUYER': return <Building2 className="w-5 h-5 text-emerald-400" />;
      case 'INVOICE': return <FileText className="w-5 h-5 text-purple-400" />;
      case 'BANK': return <Landmark className="w-5 h-5 text-amber-400" />;
      case 'PAYMENT': return <Landmark className="w-5 h-5 text-cyan-400" />;
      default: return <UserCheck className="w-5 h-5 text-slate-400" />;
    }
  };

  const getNodeBadgeColor = (trust: string) => {
    switch (trust) {
      case 'HIGH': return 'border-emerald-500 bg-emerald-950/40 text-emerald-300';
      case 'MEDIUM': return 'border-amber-500 bg-amber-950/40 text-amber-300';
      case 'SUSPICIOUS':
      case 'LOW': return 'border-red-500 bg-red-950/40 text-red-300 shadow-xl shadow-red-500/20';
      default: return 'border-slate-700 bg-slate-900 text-slate-300';
    }
  };

  return (
    <div className="glass-panel p-8 border border-white/10 flex flex-col gap-8 shadow-2xl">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-lg tracking-wide">Interactive Trust & Entity Graph</h3>
            <p className="text-xs text-slate-400 mt-0.5">Multi-layer relationship topology & suspicious edge detector for {caseNumber}</p>
          </div>
        </div>

        {/* Graph Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSuspiciousOnly(!showSuspiciousOnly)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
              showSuspiciousOnly
                ? 'bg-red-500/20 text-red-300 border-red-500 shadow-lg shadow-red-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            {showSuspiciousOnly ? 'Showing Suspicious Edges Only' : 'Highlight Suspicious Clusters'}
          </button>
        </div>
      </div>

      {/* Visual Canvas Area + Node Detail Inspector Drawer Split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Visual Graph Render Canvas (8 cols) */}
        <div className="xl:col-span-8 bg-[#060912] border border-slate-800 rounded-2xl p-8 relative min-h-[480px] flex flex-col justify-between overflow-hidden shadow-inner">
          
          {/* Grid background effect */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
              backgroundSize: '28px 28px'
            }}
          ></div>

          {/* Topology Canvas Simulated Nodes */}
          <div className="relative w-full h-[380px] flex items-center justify-center">
            
            {/* SVG Connecting Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#6B7280" />
                </marker>
                <marker id="arrow-red" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#EF4444" />
                </marker>
              </defs>

              {displayedEdges.map((edge, index) => {
                const isRed = edge.isSuspicious;
                return (
                  <g key={edge.id}>
                    <line
                      x1="20%"
                      y1={`${(index % 3) * 30 + 20}%`}
                      x2="75%"
                      y2={`${((index + 1) % 3) * 30 + 30}%`}
                      stroke={isRed ? '#EF4444' : '#3B82F6'}
                      strokeWidth={isRed ? '3' : '2'}
                      strokeDasharray={isRed ? '6 4' : 'none'}
                      className={isRed ? 'animate-pulse' : ''}
                      markerEnd={isRed ? 'url(#arrow-red)' : 'url(#arrow)'}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Interactive Graph Node Badges */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full relative z-10 p-4">
              {nodes.map((node) => {
                const isSelected = node.id === selectedNodeId;
                const isSuspicious = node.trustStatus === 'SUSPICIOUS' || node.trustStatus === 'LOW';
                
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between backdrop-blur-md ${
                      isSelected
                        ? 'ring-2 ring-blue-500 scale-105 shadow-2xl shadow-blue-500/30'
                        : ''
                    } ${getNodeBadgeColor(node.trustStatus)}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-xl bg-black/50">
                        {getNodeIcon(node.type)}
                      </div>
                      <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60">
                        {node.type}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white truncate">{node.label}</h4>
                      {node.subtitle && (
                        <p className="text-xs text-slate-300 font-mono mt-0.5 truncate">{node.subtitle}</p>
                      )}
                    </div>

                    {isSuspicious && (
                      <div className="mt-3 text-[10px] font-bold text-red-300 flex items-center gap-1.5 bg-red-950/80 px-2.5 py-1 rounded-lg border border-red-500/40">
                        <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                        RISK ANOMALY DETECTED
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* Footer status */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400 font-mono">
            <span>Nodes: {nodes.length} | Edges: {edges.length}</span>
            <span className="text-blue-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> Graph Schema: Postgres Relational v2.1
            </span>
          </div>

        </div>

        {/* Node & Edge Inspector Drawer (4 cols) */}
        <div className="xl:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-inner">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-400" />
                Entity Node Inspector
              </h4>
              <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/15 px-2.5 py-1 rounded-full border border-blue-500/30">
                ACTIVE INSPECTION
              </span>
            </div>

            {selectedNode ? (
              <div className="space-y-6 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block text-xs">Entity Label:</span>
                  <h3 className="text-base font-extrabold text-white mt-1">{selectedNode.label}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/70 p-3.5 rounded-xl border border-slate-700/60">
                    <span className="text-slate-400 text-[10px] block font-medium">Entity Class:</span>
                    <span className="font-mono text-white font-bold text-xs mt-0.5 block">{selectedNode.type}</span>
                  </div>

                  <div className="bg-slate-800/70 p-3.5 rounded-xl border border-slate-700/60">
                    <span className="text-slate-400 text-[10px] block font-medium">Trust Status:</span>
                    <span className={`font-mono font-bold text-xs mt-0.5 block ${
                      selectedNode.trustStatus === 'HIGH' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {selectedNode.trustStatus}
                    </span>
                  </div>
                </div>

                {/* Sub-network Edges */}
                <div>
                  <span className="text-slate-400 font-bold text-xs block mb-3">Connected Sub-network Edges:</span>
                  <div className="space-y-2.5">
                    {edges
                      .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                      .map(edge => (
                        <div key={edge.id} className="p-3 rounded-xl bg-black/50 border border-slate-800 font-mono text-xs flex justify-between items-center">
                          <span className="text-slate-300">{edge.label}</span>
                          {edge.isSuspicious ? (
                            <span className="text-red-400 font-bold text-[10px] bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">FLAGGED</span>
                          ) : (
                            <span className="text-blue-400 text-[10px] bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">VERIFIED</span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-slate-400 text-xs py-12 text-center">Select any node on the graph canvas to inspect its topology.</div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

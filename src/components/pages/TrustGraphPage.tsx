import React from 'react';
import { Network } from 'lucide-react';
import { TrustGraphCanvas } from '../graph/TrustGraphCanvas';
import { GraphNode, GraphEdge } from '../../types';

interface TrustGraphPageProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  caseNumber: string;
}

export const TrustGraphPage: React.FC<TrustGraphPageProps> = ({ nodes, edges, caseNumber }) => {
  return (
    <div className="space-y-10 pb-16">
      
      {/* Header */}
      <div className="panel p-8 border border-[#2E2A27] flex flex-wrap items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-white flex items-center gap-3 tracking-wide">
            <Network className="w-7 h-7 text-[#6366F1]" />
            Dedicated Trust & Entity Graph Workbench
          </h1>
          <p className="text-xs text-slate-400">
            Multi-layer relationship topology analyzer for case <strong className="text-white font-mono">{caseNumber}</strong>.
          </p>
        </div>

        <span className="badge badge-purple text-xs font-mono py-1.5 px-4">
          GRAPH ENGINE V2.1
        </span>
      </div>

      {/* Trust Graph Workbench View */}
      <TrustGraphCanvas
        nodes={nodes}
        edges={edges}
        caseNumber={caseNumber}
      />

    </div>
  );
};

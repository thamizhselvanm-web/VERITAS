import React, { useState } from 'react';
import { FileText, Eye, Layers, CheckCircle2, Percent, Sparkles } from 'lucide-react';
import { ExtractedField, LineItem } from '../../types';

interface SpatialInvoiceWorkspaceProps {
  documentName: string;
  fields: ExtractedField[];
  lineItems: LineItem[];
}

export const SpatialInvoiceWorkspace: React.FC<SpatialInvoiceWorkspaceProps> = ({
  documentName,
  fields,
  lineItems
}) => {
  const [activeFieldId, setActiveFieldId] = useState<string | null>(fields[0]?.id || null);
  const activeField = fields.find(f => f.id === activeFieldId);

  return (
    <div className="spatial-panel p-6 border border-white/10 space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-blue-500/10 text-blue-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Interactive Spatial Invoice Document Workspace</h3>
            <p className="text-xs text-[#94A3B8] font-mono mt-0.5">{documentName}</p>
          </div>
        </div>

        <span className="spatial-badge spatial-badge-cyan text-xs">
          VERITAS Vision-v4.2 OCR Engine
        </span>
      </div>

      {/* Workspace Grid per Brief Sec 12 */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Interactive Spatial Canvas (7 cols) */}
        <div className="xl:col-span-7 bg-[#05070B] border border-white/10 rounded-xl p-6 relative min-h-[480px] flex flex-col justify-between overflow-hidden">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#6366F1]" />
              <span className="text-xs font-mono font-bold text-[#94A3B8] uppercase tracking-wider">
                Spatial Field Bounding Boxes (Hover to Focus)
              </span>
            </div>
            <span className="text-[11px] text-[#6366F1] font-mono">
              Outlines highlight active attribute
            </span>
          </div>

          {/* Interactive Document Page Graphic */}
          <div className="relative w-full h-[380px] bg-[#0B1018] border border-white/10 rounded-lg p-6 font-mono text-xs text-[#C9D1D9] flex flex-col justify-between overflow-hidden shadow-xl">
            
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-bold text-white tracking-wider">Acme Components Ltd</h4>
                <p className="text-xs text-[#94A3B8] mt-0.5">Plot 45, Industrial Estate, Seattle WA</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-[#38BDF8] tracking-wider">COMMERCIAL INVOICE</p>
                <p className="text-[10px] text-[#94A3B8] font-bold mt-0.5">VERITAS DIGITAL SPATIAL RECORD</p>
              </div>
            </div>

            <div className="my-6 space-y-2.5">
              <div className="h-2 bg-white/5 rounded w-3/4"></div>
              <div className="h-2 bg-white/5 rounded w-1/2"></div>
              <div className="h-2 bg-white/5 rounded w-5/6"></div>
            </div>

            {/* Spatial Bounding Boxes */}
            {fields.map((field) => {
              const isActive = field.id === activeFieldId;
              return (
                <div
                  key={field.id}
                  onMouseEnter={() => setActiveFieldId(field.id)}
                  onClick={() => setActiveFieldId(field.id)}
                  style={{
                    left: `${field.spatialBox.x}%`,
                    top: `${field.spatialBox.y}%`,
                    width: `${field.spatialBox.w}%`,
                    height: `${field.spatialBox.h}%`
                  }}
                  className={`bbox-highlight ${isActive ? 'active' : ''}`}
                >
                  {isActive && (
                    <div className="absolute -top-6 left-0 bg-[#6366F1] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
                      {field.label}: {field.confidence}% Confidence
                    </div>
                  )}
                </div>
              );
            })}

            <div className="border-t border-white/10 pt-3 flex justify-between text-[11px] text-[#94A3B8]">
              <span>CANONICAL SHA-256 MATCH: VERIFIED</span>
              <span>PAGE 1 OF 1</span>
            </div>

          </div>

          {activeField && (
            <div className="mt-4 p-3 rounded-lg bg-[#111827] border border-[#6366F1]/40 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#6366F1]" />
                <span className="text-[#94A3B8]">Focused Attribute: <strong className="text-white">{activeField.label}</strong></span>
              </div>
              <span className="text-[#38BDF8] font-bold text-sm">{activeField.value}</span>
            </div>
          )}

        </div>

        {/* Right Extracted Intelligence Attributes (5 cols) */}
        <div className="xl:col-span-5 space-y-4">
          
          <span className="text-xs font-mono font-bold text-[#94A3B8] uppercase tracking-wider block">
            Extracted Intelligence Attributes
          </span>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {fields.map((field) => {
              const isActive = field.id === activeFieldId;
              return (
                <div
                  key={field.id}
                  onMouseEnter={() => setActiveFieldId(field.id)}
                  onClick={() => setActiveFieldId(field.id)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between text-xs ${
                    isActive
                      ? 'bg-[#111827] border-[#6366F1]'
                      : 'bg-[#05070B] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div>
                    <span className="text-[#94A3B8] text-[11px] block">{field.label}</span>
                    <span className="font-bold text-white font-mono text-sm mt-0.5 block">{field.value}</span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-[#38BDF8] text-sm">{field.confidence}%</span>
                    <span className="text-[10px] text-[#64748B] block">Confidence</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Line Items Table */}
          <div className="border-t border-white/10 pt-4 space-y-2">
            <span className="text-xs font-mono font-bold text-[#94A3B8] uppercase tracking-wider block">Extracted Line Items</span>
            
            <div className="bg-[#05070B] rounded-lg border border-white/10 overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0B1018] text-[#64748B] font-mono border-b border-white/10">
                    <th className="p-2.5">Description</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Unit Price</th>
                    <th className="p-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-[#C9D1D9]">
                  {lineItems.map((item) => (
                    <tr key={item.id}>
                      <td className="p-2.5 text-white font-sans">{item.description}</td>
                      <td className="p-2.5 text-center font-numeric">{item.quantity}</td>
                      <td className="p-2.5 text-right font-numeric">${(item.unitPriceMinor / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="p-2.5 text-right font-numeric font-bold text-[#38BDF8]">${(item.totalMinor / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

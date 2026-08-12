import React, { useState } from 'react';
import { FileText, CheckCircle2, AlertTriangle, Eye, Layers, Percent } from 'lucide-react';
import { ExtractedField, LineItem } from '../../types';

interface DocumentExtractionViewerProps {
  documentName: string;
  documentUrl: string;
  fields: ExtractedField[];
  lineItems: LineItem[];
}

export const DocumentExtractionViewer: React.FC<DocumentExtractionViewerProps> = ({
  documentName,
  fields,
  lineItems
}) => {
  const [activeFieldId, setActiveFieldId] = useState<string | null>(fields[0]?.id || null);
  const activeField = fields.find(f => f.id === activeFieldId);

  return (
    <div className="inst-card p-6 border border-[#30363D] flex flex-col gap-6 shadow-xl font-sans">
      
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#30363D] pb-3.5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-blue-500/10 text-blue-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Document Intelligence & Spatial OCR</h3>
            <p className="text-xs text-[#8B949E] font-mono mt-0.5">{documentName}</p>
          </div>
        </div>

        <span className="inst-badge inst-badge-info">VERITAS Vision-v4.2</span>
      </div>

      {/* Split Grid View */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Column: Spatial Bounding Box PDF Preview (7 cols) */}
        <div className="xl:col-span-7 bg-[#0D1117] rounded border border-[#30363D] p-6 relative min-h-[460px] flex flex-col justify-between overflow-hidden">
          
          <div className="flex items-center justify-between border-b border-[#30363D] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-mono font-bold text-[#8B949E] uppercase tracking-wider">
                Spatial Bounding Box Overlay
              </span>
            </div>
            <span className="text-[11px] text-[#58A6FF] font-mono">
              Click spatial region to inspect field
            </span>
          </div>

          {/* PDF Page Graphic Simulator with Overlays */}
          <div className="relative w-full h-[380px] bg-[#161B22] border border-[#30363D] rounded p-6 font-mono text-xs text-[#C9D1D9] flex flex-col justify-between overflow-hidden">
            
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-bold text-white tracking-wider">Acme Components Ltd</h4>
                <p className="text-xs text-[#8B949E] mt-0.5">Plot 45, Industrial Estate</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-blue-400 tracking-wider">TAX INVOICE</p>
                <p className="text-[10px] text-[#8B949E] font-bold mt-0.5">ORIGINAL DOCUMENT</p>
              </div>
            </div>

            <div className="my-6 space-y-2.5">
              <div className="h-2 bg-[#21262D] rounded w-3/4"></div>
              <div className="h-2 bg-[#21262D] rounded w-1/2"></div>
              <div className="h-2 bg-[#21262D] rounded w-5/6"></div>
            </div>

            {/* Bounding Box Highlights Overlaid */}
            {fields.map((field) => {
              const isActive = field.id === activeFieldId;
              return (
                <div
                  key={field.id}
                  onClick={() => setActiveFieldId(field.id)}
                  style={{
                    left: `${field.spatialBox.x}%`,
                    top: `${field.spatialBox.y}%`,
                    width: `${field.spatialBox.w}%`,
                    height: `${field.spatialBox.h}%`
                  }}
                  className={`bbox-highlight ${isActive ? 'active' : ''}`}
                  title={`${field.label}: ${field.value} (${field.confidence}% confidence)`}
                >
                  <div className="absolute -top-5 left-0 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded whitespace-nowrap">
                    {field.label}: {field.confidence}%
                  </div>
                </div>
              );
            })}

            <div className="border-t border-[#30363D] pt-3 flex justify-between text-[11px] text-[#8B949E]">
              <span>CANONICAL DIGEST: VERIFIED</span>
              <span>PAGE 1 OF 1</span>
            </div>

          </div>

          {activeField && (
            <div className="mt-4 p-3 rounded bg-[#161B22] border border-[#30363D] flex items-center justify-between text-xs font-mono">
              <span className="text-[#8B949E]">Selected Field: <strong className="text-white">{activeField.label}</strong></span>
              <span className="text-blue-400 font-bold">{activeField.value}</span>
            </div>
          )}

        </div>

        {/* Right Column: Extracted Values & Line Items Table (5 cols) */}
        <div className="xl:col-span-5 space-y-4">
          
          <span className="text-xs font-bold text-[#8B949E] uppercase tracking-wider block">Extracted Attributes</span>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {fields.map((field) => {
              const isActive = field.id === activeFieldId;
              return (
                <div
                  key={field.id}
                  onClick={() => setActiveFieldId(field.id)}
                  className={`p-3 rounded border transition-colors cursor-pointer flex items-center justify-between text-xs ${
                    isActive
                      ? 'bg-[#21262D] border-blue-500'
                      : 'bg-[#0D1117] border-[#30363D] hover:border-[#484F58]'
                  }`}
                >
                  <div>
                    <span className="text-[#8B949E] text-[11px] block">{field.label}</span>
                    <span className="font-bold text-white font-mono mt-0.5 block">{field.value}</span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-blue-400">{field.confidence}%</span>
                    <span className="text-[10px] text-[#8B949E] block">Confidence</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Line Items Table */}
          <div className="border-t border-[#30363D] pt-4 space-y-2">
            <span className="text-xs font-bold text-[#8B949E] uppercase tracking-wider block">Line Items</span>
            
            <div className="bg-[#0D1117] rounded border border-[#30363D] overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#161B22] text-[#8B949E] font-mono border-b border-[#30363D]">
                    <th className="p-2.5">Description</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Unit Price</th>
                    <th className="p-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30363D] font-mono text-[#C9D1D9]">
                  {lineItems.map((item) => (
                    <tr key={item.id}>
                      <td className="p-2.5 text-white font-sans">{item.description}</td>
                      <td className="p-2.5 text-center font-numeric">{item.quantity}</td>
                      <td className="p-2.5 text-right font-numeric">${(item.unitPriceMinor / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="p-2.5 text-right font-numeric font-bold text-blue-400">${(item.totalMinor / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
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

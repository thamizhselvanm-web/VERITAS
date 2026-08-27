import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Search, Filter, Layers, Eye, RefreshCw, Database, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { GraphNode, GraphEdge } from '../../types';

interface TrustGraph3DProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  caseNumber: string;
}

// Built-in standalone sample datasets for interactive demonstration
const DEMO_PRESETS: Record<string, { name: string; description: string; nodes: GraphNode[]; edges: GraphEdge[] }> = {
  'scenario-1': {
    name: 'Sample A: Acme Components — 10-Node Supply Chain & Duplicate Signal',
    description: 'Real-time multi-tier topology showing duplicate invoice anomaly (94.2% similarity), tax validation, and L2 notary sealing.',
    nodes: [
      { id: 'n-seller', label: 'Acme Components Ltd', type: 'SELLER', trustStatus: 'HIGH', subtitle: 'GSTIN: IN-9840291-GST · Primary Supplier' },
      { id: 'n-buyer', label: 'Meridian Industries Inc', type: 'BUYER', trustStatus: 'HIGH', subtitle: 'GSTIN: IN-1029384-GST · Corporate Buyer' },
      { id: 'n-inv', label: 'INV-1024 (Active Audit)', type: 'INVOICE', trustStatus: 'HIGH', subtitle: '₹5,00,000.00 · Financed Node' },
      { id: 'n-prev', label: 'INV-984 (Fuzzy Anomaly)', type: 'INVOICE', trustStatus: 'SUSPICIOUS', subtitle: '₹4,99,500.00 · 94.2% Duplicate Risk' },
      { id: 'n-pay1', label: 'HDFC Settlement Bank #9920', type: 'BANK', trustStatus: 'HIGH', subtitle: 'IFSC: HDFC0001092 · ESCROW Account' },
      { id: 'n-po', label: 'PO-2026-8819 (Verified)', type: 'PO', trustStatus: 'HIGH', subtitle: 'Matched PO Amount ₹5,00,000.00' },
      { id: 'n-shipping', label: 'Bill of Lading BL-99402', type: 'DELIVERY', trustStatus: 'HIGH', subtitle: 'Logistics Dispatch Confirmed' },
      { id: 'n-tax', label: 'GSTN Portal Validation Node', type: 'TAX', trustStatus: 'HIGH', subtitle: 'E-Way Bill Active & Filing Compliant' },
      { id: 'n-notary', label: 'Arbitrum Merkle Notary L2', type: 'CHAIN', trustStatus: 'HIGH', subtitle: 'Block #1849201 · Cryptographic Proof' },
      { id: 'n-tier2', label: 'Quantum Precision Tools', type: 'SELLER', trustStatus: 'MEDIUM', subtitle: 'Tier-2 Micro-Component Subcontractor' }
    ],
    edges: [
      { id: 'e1', source: 'n-seller', target: 'n-inv', label: 'ISSUED_BY', amountFormatted: '₹5,00,000' },
      { id: 'e2', source: 'n-inv', target: 'n-buyer', label: 'BILLED_TO', amountFormatted: '₹5,00,000' },
      { id: 'e3', source: 'n-inv', target: 'n-prev', label: '94.2% FUZZY SIMILARITY', isSuspicious: true },
      { id: 'e4', source: 'n-seller', target: 'n-pay1', label: 'SETTLEMENT_GATEWAY' },
      { id: 'e5', source: 'n-inv', target: 'n-po', label: 'PO_MATCHED' },
      { id: 'e6', source: 'n-inv', target: 'n-shipping', label: 'LOGISTICS_DISPATCH' },
      { id: 'e7', source: 'n-seller', target: 'n-tax', label: 'TAX_VERIFIED' },
      { id: 'e8', source: 'n-inv', target: 'n-notary', label: 'CHAIN_NOTARIZED' },
      { id: 'e9', source: 'n-seller', target: 'n-tier2', label: 'TIER_2_SUPPLIER' }
    ]
  },
  'scenario-2': {
    name: 'Sample B: AeroDynamics Tech — Cross-Border Aerospace Financing',
    description: 'High-confidence international trade network with FedWire bank settlement and verified purchase orders.',
    nodes: [
      { id: 'n-seller', label: 'AeroDynamics Tech LLC', type: 'SELLER', trustStatus: 'HIGH', subtitle: 'Tax ID: US-9840291 · Aerospace Vendor' },
      { id: 'n-buyer', label: 'Global Logistics Corp', type: 'BUYER', trustStatus: 'HIGH', subtitle: 'Tax ID: US-1029384 · Freight Logistics' },
      { id: 'n-inv', label: 'INV-2026-8819', type: 'INVOICE', trustStatus: 'HIGH', subtitle: '$185,000.00 · Single Facility' },
      { id: 'n-pay1', label: 'JPMorgan Chase Account #9920', type: 'BANK', trustStatus: 'HIGH', subtitle: 'FedWire Account Verified' },
      { id: 'n-po', label: 'PO-AERO-99201', type: 'PO', trustStatus: 'HIGH', subtitle: '$185,000.00 Verified Match' },
      { id: 'n-customs', label: 'US Customs Declaration C-8819', type: 'TAX', trustStatus: 'HIGH', subtitle: 'Import Duties Cleared' }
    ],
    edges: [
      { id: 'e1', source: 'n-seller', target: 'n-inv', label: 'ISSUED_BY', amountFormatted: '$185,000' },
      { id: 'e2', source: 'n-inv', target: 'n-buyer', label: 'BILLED_TO', amountFormatted: '$185,000' },
      { id: 'e3', source: 'n-seller', target: 'n-pay1', label: 'SETTLEMENT_GATEWAY' },
      { id: 'e4', source: 'n-inv', target: 'n-po', label: 'PO_MATCHED' },
      { id: 'e5', source: 'n-inv', target: 'n-customs', label: 'CUSTOMS_CLEARED' }
    ]
  },
  'scenario-3': {
    name: 'Sample C: Circular Multi-Entity Risk Network — High Alert Topology',
    description: 'Interconnected network containing circular trading risk signals, unverified shell bank accounts, and high amount deviations.',
    nodes: [
      { id: 'n-shell1', label: 'Apex Holding Alpha', type: 'SELLER', trustStatus: 'SUSPICIOUS', subtitle: 'Offshore Entity · Zero Turnover Flag' },
      { id: 'n-shell2', label: 'Apex Holding Beta', type: 'BUYER', trustStatus: 'SUSPICIOUS', subtitle: 'Related Party Entity · Circular Risk' },
      { id: 'n-inv', label: 'INV-RISK-9901', type: 'INVOICE', trustStatus: 'SUSPICIOUS', subtitle: '₹12,50,000.00 · 18.7x Amount Spike' },
      { id: 'n-bank-bad', label: 'Unverified Overseas Account', type: 'BANK', trustStatus: 'SUSPICIOUS', subtitle: 'Kyc Status: Pending Audit' },
      { id: 'n-po-missing', label: 'Unverified PO Ref #0019', type: 'PO', trustStatus: 'SUSPICIOUS', subtitle: 'Missing Stamp & E-Signature' }
    ],
    edges: [
      { id: 'e1', source: 'n-shell1', target: 'n-inv', label: 'SUSPICIOUS_ISSUANCE', isSuspicious: true },
      { id: 'e2', source: 'n-inv', target: 'n-shell2', label: 'CIRCULAR_BILLED_TO', isSuspicious: true },
      { id: 'e3', source: 'n-shell1', target: 'n-bank-bad', label: 'UNVERIFIED_GATEWAY', isSuspicious: true },
      { id: 'e4', source: 'n-inv', target: 'n-po-missing', label: 'PO_DISCREPANCY_FLAG', isSuspicious: true }
    ]
  }
};

export const TrustGraph3D: React.FC<TrustGraph3DProps> = ({ nodes: propNodes, edges: propEdges, caseNumber }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedPresetKey, setSelectedPresetKey] = useState<string>('scenario-1');
  const activePreset = DEMO_PRESETS[selectedPresetKey] || DEMO_PRESETS['scenario-1'];

  // Prefer prop nodes if available, otherwise fall back to preset
  const activeNodes = (propNodes && propNodes.length > 0) ? propNodes : activePreset.nodes;
  const activeEdges = (propEdges && propEdges.length > 0) ? propEdges : activePreset.edges;

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(activeNodes[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSuspicious, setFilterSuspicious] = useState(false);

  // Filter nodes based on search or suspicious toggle
  const filteredNodes = activeNodes.filter(node => {
    const matchesSearch = !searchQuery || node.label.toLowerCase().includes(searchQuery.toLowerCase()) || (node.subtitle && node.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSuspicious = !filterSuspicious || node.trustStatus === 'SUSPICIOUS';
    return matchesSearch && matchesSuspicious;
  });

  useEffect(() => {
    setSelectedNode(activeNodes[0] || null);
  }, [selectedPresetKey, propNodes]);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 560;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 65);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    containerRef.current.appendChild(renderer.domElement);

    const graphGroup = new THREE.Group();
    scene.add(graphGroup);

    // Render 3D Nodes
    const nodeMeshes: THREE.Mesh[] = [];
    const radiusStep = 24;

    filteredNodes.forEach((node, idx) => {
      const angle = (idx / filteredNodes.length) * Math.PI * 2;
      const x = Math.cos(angle) * radiusStep;
      const y = Math.sin(angle) * radiusStep;
      const z = ((idx % 3) - 1) * 8;

      let color = 0x6366F1; // Indigo / Default
      if (node.type === 'SELLER') color = 0x4F46E5;       // Royal Indigo
      if (node.type === 'BUYER') color = 0x10B981;        // Emerald Green
      if (node.type === 'INVOICE') color = 0x8B5CF6;      // Purple
      if (node.type === 'PO' || node.type === 'DELIVERY' || node.type === 'TAX') color = 0xF59E0B; // Amber
      if (node.type === 'BANK' || node.type === 'CHAIN') color = 0x06B6D4; // Cyan
      if (node.trustStatus === 'SUSPICIOUS') color = 0xEF4444; // Red

      const geometry = new THREE.SphereGeometry(2.4, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.2,
        metalness: 0.6,
        emissive: color,
        emissiveIntensity: node.trustStatus === 'SUSPICIOUS' ? 0.4 : 0.15
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.userData = node;

      graphGroup.add(mesh);
      nodeMeshes.push(mesh);
    });

    // Add Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x6366f1, 2.0);
    dirLight1.position.set(20, 40, 30);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x10b981, 1.5);
    dirLight2.position.set(-20, -30, -20);
    scene.add(dirLight2);

    // Render 3D Relationship Edges
    activeEdges.forEach((edge) => {
      const sourceNode = nodeMeshes.find(m => (m.userData as GraphNode).id === edge.source);
      const targetNode = nodeMeshes.find(m => (m.userData as GraphNode).id === edge.target);

      if (sourceNode && targetNode) {
        const points = [sourceNode.position.clone(), targetNode.position.clone()];
        const edgeGeometry = new THREE.BufferGeometry().setFromPoints(points);

        const edgeMaterial = new THREE.LineBasicMaterial({
          color: edge.isSuspicious ? 0xEF4444 : 0x6366F1,
          transparent: true,
          opacity: edge.isSuspicious ? 0.9 : 0.45,
          linewidth: edge.isSuspicious ? 3 : 1
        });

        const line = new THREE.Line(edgeGeometry, edgeMaterial);
        graphGroup.add(line);
      }
    });

    // Raycasting for Mouse Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let animId: number;

    const dom = renderer.domElement;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = dom.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);
      if (intersects.length > 0) {
        const selected = intersects[0].object.userData as GraphNode;
        setSelectedNode(selected);
      }
    };

    dom.addEventListener('mousemove', handlePointerMove);
    dom.addEventListener('click', handleClick);

    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      graphGroup.rotation.y += dx * 0.005;
      graphGroup.rotation.x += dy * 0.005;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };

    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) {
        graphGroup.rotation.y += 0.0015;
      }
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousemove', handlePointerMove);
      dom.removeEventListener('click', handleClick);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (containerRef.current && dom) {
        containerRef.current.removeChild(dom);
      }
      renderer.dispose();
    };
  }, [filteredNodes, activeEdges, selectedPresetKey]);

  return (
    <div className="bg-[#1C1917] border border-[#2E2A27] rounded-2xl p-4.5 sm:p-6 flex flex-col gap-5 shadow-2xl font-sans relative">
      
      {/* Header & Sample Scenario Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2E2A27] pb-4">
        <div>
          <h3 className="font-extrabold text-[#F7F4F1] text-base sm:text-lg tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#6366F1]" />
            3D Financial Trust Graph Workbench
          </h3>
          <p className="text-xs text-[#9E8C7C] font-mono mt-0.5">
            Interactive entity relationship topology for <strong className="text-[#6366F1]">{caseNumber}</strong>
          </p>
        </div>

        {/* Sample Dataset Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#6366F1]" />
            <select
              value={selectedPresetKey}
              onChange={(e) => setSelectedPresetKey(e.target.value)}
              className="bg-[#141211] border border-[#2E2A27] text-[#D8C7B8] text-xs font-mono py-2 px-3 rounded-xl outline-none cursor-pointer focus:border-[#6366F1]"
              aria-label="Select Sample Graph Scenario"
            >
              <option value="scenario-1">Sample A: 10-Node Supply Chain & Anomaly</option>
              <option value="scenario-2">Sample B: Cross-Border Trade & FedWire</option>
              <option value="scenario-3">Sample C: High Risk Circular Network</option>
            </select>
          </div>

          <button
            onClick={() => setFilterSuspicious(!filterSuspicious)}
            className={`text-xs px-3 py-2 rounded-xl border font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterSuspicious 
                ? 'bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444]' 
                : 'bg-[#262320] border-[#2E2A27] text-[#D8C7B8] hover:border-[#6366F1]'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            {filterSuspicious ? 'Suspicious Only' : 'All Clusters'}
          </button>
        </div>
      </div>

      {/* Preset Description Alert */}
      <div className="p-3.5 rounded-xl bg-[#141211] border border-[#2E2A27] flex items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-[#D8C7B8]">
          <span className="w-2 h-2 rounded-full bg-[#6366F1] animate-pulse" />
          <span><strong className="text-[#F7F4F1]">{activePreset.name}:</strong> {activePreset.description}</span>
        </div>
        <span className="text-[10px] text-[#9E8C7C] hidden md:inline-block">Drag canvas to rotate 360°</span>
      </div>

      {/* 3D Canvas & Floating Inspector Split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-[520px]">
        
        {/* Canvas (8 cols) */}
        <div className="xl:col-span-8 bg-[#141211] border border-[#2E2A27] rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-inner">
          <div ref={containerRef} className="w-full h-full min-h-[480px] cursor-grab active:cursor-grabbing" />

          {/* Color Legend Bar */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 text-[10px] font-mono bg-[#1C1917]/90 px-3 py-2 rounded-xl border border-[#2E2A27] backdrop-blur-md text-[#D8C7B8]">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#4F46E5]" /> Seller</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> Buyer</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" /> Invoice</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> PO/Shipping/Tax</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]" /> Bank/Notary</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /> Suspicious Flag</span>
          </div>

          <div className="absolute bottom-4 left-4 text-xs text-[#9E8C7C] font-mono bg-[#1C1917]/90 px-3 py-1.5 rounded-xl border border-[#2E2A27] backdrop-blur-md">
            Nodes: {filteredNodes.length} | Edges: {activeEdges.length} | Orbit: Drag 360°
          </div>
        </div>

        {/* Selected Entity Inspector Panel (4 cols) */}
        <div className="xl:col-span-4 bg-[#141211] border border-[#2E2A27] rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-[#2E2A27] pb-3 mb-4">
              <h4 className="font-bold text-[#F7F4F1] text-xs uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#6366F1]" />
                Entity Node Inspector
              </h4>
              <span className="text-[10px] font-mono text-[#6366F1] bg-[#6366F1]/10 px-2 py-0.5 rounded border border-[#6366F1]/30">INSPECTION</span>
            </div>

            {selectedNode ? (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[#9E8C7C] font-mono text-[10px] block uppercase">Entity Name:</span>
                  <h3 className="text-base font-bold text-[#F7F4F1] mt-0.5">{selectedNode.label}</h3>
                  {selectedNode.subtitle && (
                    <p className="text-xs text-[#6366F1] font-mono mt-0.5">{selectedNode.subtitle}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#1C1917] p-3 rounded-xl border border-[#2E2A27]">
                    <span className="text-[#9E8C7C] text-[10px] block font-mono">Entity Class:</span>
                    <span className="font-mono text-[#F7F4F1] font-bold text-xs mt-0.5 block">{selectedNode.type}</span>
                  </div>

                  <div className="bg-[#1C1917] p-3 rounded-xl border border-[#2E2A27]">
                    <span className="text-[#9E8C7C] text-[10px] block font-mono">Trust Status:</span>
                    <span className={`font-mono font-bold text-xs mt-0.5 flex items-center gap-1 ${
                      selectedNode.trustStatus === 'HIGH' ? 'text-[#10B981]' : selectedNode.trustStatus === 'SUSPICIOUS' ? 'text-[#EF4444]' : 'text-[#F59E0B]'
                    }`}>
                      {selectedNode.trustStatus === 'HIGH' ? <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> : <ShieldAlert className="w-3.5 h-3.5 text-[#EF4444]" />}
                      {selectedNode.trustStatus}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[#D8C7B8] font-bold block mb-2">Connected Relationships:</span>
                  <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {activeEdges
                      .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                      .map(edge => (
                        <div key={edge.id} className="p-2.5 rounded-xl bg-[#1C1917] border border-[#2E2A27] text-xs font-mono flex justify-between items-center">
                          <span className="text-[#D8C7B8]">{edge.label}</span>
                          {edge.isSuspicious ? (
                            <span className="pill risk text-[10px]">FLAGGED</span>
                          ) : (
                            <span className="pill verified text-[10px]">VERIFIED</span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-xs text-[#9E8C7C] py-12 text-center font-mono">Click any 3D node on the canvas to inspect topology.</div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

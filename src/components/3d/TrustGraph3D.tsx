import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Search, Filter, RefreshCw, ZoomIn, ZoomOut, Layers, Eye } from 'lucide-react';
import { GraphNode, GraphEdge } from '../../types';

interface TrustGraph3DProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  caseNumber: string;
}

export const TrustGraph3D: React.FC<TrustGraph3DProps> = ({ nodes, edges, caseNumber }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(nodes[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSuspicious, setFilterSuspicious] = useState(false);

  const activeNodes = searchQuery
    ? nodes.filter(n => n.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : nodes;

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 60);

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
    const radiusStep = 22;

    nodes.forEach((node, idx) => {
      const angle = (idx / nodes.length) * Math.PI * 2;
      const x = Math.cos(angle) * radiusStep;
      const y = Math.sin(angle) * radiusStep;
      const z = (Math.random() - 0.5) * 10;

      let color = 0x388bfd; // Blue
      if (node.type === 'SELLER') color = 0x388bfd;
      if (node.type === 'BUYER') color = 0x3fb950;
      if (node.type === 'INVOICE') color = 0xa371f7;
      if (node.trustStatus === 'SUSPICIOUS') color = 0xf85149;

      const geometry = new THREE.SphereGeometry(2.2, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.userData = node;

      // Glow halo
      const haloGeo = new THREE.SphereGeometry(3.2, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.25
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      mesh.add(halo);

      graphGroup.add(mesh);
      nodeMeshes.push(mesh);
    });

    // Render Edges
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.35
    });

    const linePositions: number[] = [];
    edges.forEach((edge) => {
      const sourceNode = nodeMeshes.find(m => (m.userData as GraphNode).id === edge.source);
      const targetNode = nodeMeshes.find(m => (m.userData as GraphNode).id === edge.target);

      if (sourceNode && targetNode) {
        linePositions.push(
          sourceNode.position.x, sourceNode.position.y, sourceNode.position.z,
          targetNode.position.x, targetNode.position.y, targetNode.position.z
        );
      }
    });

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    graphGroup.add(lines);

    // Raycaster hover/select
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);

      if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'default';
      }
    };

    const handleClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);
      if (intersects.length > 0) {
        const selected = intersects[0].object.userData as GraphNode;
        setSelectedNode(selected);

        // Dim non-selected nodes per Brief Sec 14
        nodeMeshes.forEach(m => {
          if (m.userData.id === selected.id) {
            (m.material as THREE.MeshBasicMaterial).opacity = 1;
            m.scale.set(1.4, 1.4, 1.4);
          } else {
            (m.material as THREE.MeshBasicMaterial).opacity = 0.35;
            m.scale.set(1, 1, 1);
          }
        });
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousemove', handlePointerMove);
    dom.addEventListener('click', handleClick);

    // Orbit Animation
    let animId: number;
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
  }, [nodes, edges]);

  return (
    <div className="spatial-panel p-6 border border-white/10 flex flex-col gap-5 shadow-2xl font-sans relative">
      
      {/* Header & Graph Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#00F0FF]" />
            Full-Screen Interactive 3D Trust Graph
          </h3>
          <p className="text-xs text-[#94A3B8] font-mono mt-0.5">Multi-layer relationship topology for {caseNumber}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-60">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search entity node..."
              className="w-full bg-[#05070B] border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F0FF]"
            />
          </div>

          <button
            onClick={() => setFilterSuspicious(!filterSuspicious)}
            className={`spatial-badge text-xs px-3 py-1.5 border transition-all cursor-pointer ${
              filterSuspicious ? 'spatial-badge-risk' : 'spatial-badge-cyan'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            {filterSuspicious ? 'Suspicious Only' : 'All Clusters'}
          </button>
        </div>
      </div>

      {/* 3D Canvas & Floating Inspector Split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-[520px]">
        
        {/* Canvas (8 cols) */}
        <div className="xl:col-span-8 bg-[#05070B] border border-white/10 rounded-xl relative overflow-hidden flex flex-col justify-between">
          <div ref={containerRef} className="w-full h-full min-h-[480px] cursor-grab active:cursor-grabbing" />

          <div className="absolute bottom-4 left-4 text-xs text-[#94A3B8] font-mono bg-black/60 px-3 py-1.5 rounded border border-white/10 backdrop-blur-md">
            Nodes: {nodes.length} | Edges: {edges.length} | Orbit: Drag to Rotate
          </div>
        </div>

        {/* Selected Entity Inspector Panel per Brief Sec 14 (4 cols) */}
        <div className="xl:col-span-4 spatial-panel p-5 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#00F0FF]" />
                Entity Node Inspector
              </h4>
              <span className="spatial-badge spatial-badge-cyan text-[10px]">INSPECTION</span>
            </div>

            {selectedNode ? (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[#94A3B8] font-medium block">Entity Name:</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{selectedNode.label}</h3>
                  {selectedNode.subtitle && (
                    <p className="text-xs text-[#00F0FF] font-mono mt-0.5">{selectedNode.subtitle}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#05070B] p-3 rounded border border-white/10">
                    <span className="text-[#64748B] text-[10px] block">Entity Class:</span>
                    <span className="font-mono text-white font-bold text-xs mt-0.5 block">{selectedNode.type}</span>
                  </div>

                  <div className="bg-[#05070B] p-3 rounded border border-white/10">
                    <span className="text-[#64748B] text-[10px] block">Trust Status:</span>
                    <span className={`font-mono font-bold text-xs mt-0.5 block ${
                      selectedNode.trustStatus === 'HIGH' ? 'text-[#3FB950]' : 'text-[#F85149]'
                    }`}>
                      {selectedNode.trustStatus}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[#94A3B8] font-bold block mb-2">Connected Relationships:</span>
                  <div className="space-y-2">
                    {edges
                      .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                      .map(edge => (
                        <div key={edge.id} className="p-2.5 rounded bg-[#05070B] border border-white/10 text-xs font-mono flex justify-between items-center">
                          <span className="text-[#C9D1D9]">{edge.label}</span>
                          {edge.isSuspicious ? (
                            <span className="spatial-badge spatial-badge-risk text-[10px]">FLAGGED</span>
                          ) : (
                            <span className="spatial-badge spatial-badge-verified text-[10px]">VERIFIED</span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-xs text-[#94A3B8] py-12 text-center">Click any 3D node on the canvas to inspect topology.</div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

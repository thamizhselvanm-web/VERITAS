import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface SphereNodeData {
  id: string;
  name: string;
  type: 'COMPANY' | 'INVOICE' | 'TRANSACTION' | 'EVIDENCE' | 'RISK';
  trustScore: number;
  volume: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  pos: THREE.Vector3;
}

interface TrustSphere3DProps {
  onSelectEntity?: (nodeId: string) => void;
}

export const TrustSphere3D: React.FC<TrustSphere3DProps> = ({ onSelectEntity }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<SphereNodeData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 600;
    const height = mountRef.current.clientHeight || 500;

    // 3D Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 48;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }
    mountRef.current.appendChild(renderer.domElement);

    // Group holding the entire Trust Sphere
    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // Abstract 3D Inner Wireframe Sphere
    const sphereGeo = new THREE.IcosahedronGeometry(18, 2);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.08
    });
    const innerSphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphereGroup.add(innerSphere);

    // Nodes dataset distributed around sphere surface
    const rawNodes = [
      { id: 'n1', name: 'Acme Components Ltd', type: 'COMPANY', trustScore: 82, volume: '₹5,00,000', riskLevel: 'MEDIUM' },
      { id: 'n2', name: 'Meridian Industries Inc', type: 'COMPANY', trustScore: 91, volume: '₹12,40,000', riskLevel: 'LOW' },
      { id: 'n3', name: 'INV-1024', type: 'INVOICE', trustScore: 82, volume: '₹5,00,000', riskLevel: 'MEDIUM' },
      { id: 'n4', name: 'AeroDynamics Tech LLC', type: 'COMPANY', trustScore: 94, volume: '$185,000', riskLevel: 'LOW' },
      { id: 'n5', name: 'Global Logistics Corp', type: 'COMPANY', trustScore: 96, volume: '$450,000', riskLevel: 'LOW' },
      { id: 'n6', name: 'INV-2026-8819', type: 'INVOICE', trustScore: 94, volume: '$185,000', riskLevel: 'LOW' },
      { id: 'n7', name: 'Vanguard Industrial', type: 'COMPANY', trustScore: 18, volume: '$185,000', riskLevel: 'CRITICAL' },
      { id: 'n8', name: 'Duplicate SHA-256 Flag', type: 'RISK', trustScore: 18, volume: 'Collision', riskLevel: 'CRITICAL' },
      { id: 'n9', name: 'Apex Quantum Hardware', type: 'COMPANY', trustScore: 54, volume: '$95,000', riskLevel: 'MEDIUM' },
      { id: 'n10', name: 'Signed PO-9920 Proof', type: 'EVIDENCE', trustScore: 95, volume: 'Verified', riskLevel: 'LOW' }
    ];

    const nodesData: SphereNodeData[] = [];
    const nodeMeshes: THREE.Mesh[] = [];
    const radius = 18;

    // Distribute nodes using Fibonacci sphere algorithm
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < rawNodes.length; i++) {
      const y = 1 - (i / (rawNodes.length - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const pos = new THREE.Vector3(
        Math.cos(theta) * r * radius,
        y * radius,
        Math.sin(theta) * r * radius
      );

      const nodeData: SphereNodeData = {
        ...rawNodes[i] as any,
        pos
      };
      nodesData.push(nodeData);

      // Node mesh geometry & color based on risk
      let colorHex = 0x388bfd; // Blue default
      if (nodeData.riskLevel === 'CRITICAL') colorHex = 0xf85149; // Red
      if (nodeData.riskLevel === 'MEDIUM') colorHex = 0xd29922; // Amber
      if (nodeData.riskLevel === 'LOW') colorHex = 0x3fb950; // Emerald

      const nodeGeo = new THREE.SphereGeometry(1.1, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({ color: colorHex });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(pos);
      nodeMesh.userData = nodeData;

      // Glow halo
      const haloGeo = new THREE.SphereGeometry(1.6, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.25
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      nodeMesh.add(haloMesh);

      sphereGroup.add(nodeMesh);
      nodeMeshes.push(nodeMesh);
    }

    // Dynamic Connection Lines
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.25
    });

    const linePositions: number[] = [];
    for (let i = 0; i < nodesData.length; i++) {
      for (let j = i + 1; j < nodesData.length; j++) {
        if (nodesData[i].pos.distanceTo(nodesData[j].pos) < 26) {
          linePositions.push(
            nodesData[i].pos.x, nodesData[i].pos.y, nodesData[i].pos.z,
            nodesData[j].pos.x, nodesData[j].pos.y, nodesData[j].pos.z
          );
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const connectionLines = new THREE.LineSegments(lineGeo, lineMat);
    sphereGroup.add(connectionLines);

    // Raycasting for Hover/Click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);

      if (intersects.length > 0) {
        const hitData = intersects[0].object.userData as SphereNodeData;
        setHoveredNode(hitData);
        setTooltipPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
        document.body.style.cursor = 'pointer';
      } else {
        setHoveredNode(null);
        document.body.style.cursor = 'default';
      }
    };

    const handleClick = () => {
      if (hoveredNode && onSelectEntity) {
        onSelectEntity(hoveredNode.id);
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousemove', handlePointerMove);
    dom.addEventListener('click', handleClick);

    // Orbit Animation Loop
    let animId: number;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      sphereGroup.rotation.y += deltaX * 0.005;
      sphereGroup.rotation.x += deltaY * 0.005;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };

    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) {
        sphereGroup.rotation.y += 0.002;
        sphereGroup.rotation.x += 0.0008;
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
      if (mountRef.current && dom) {
        mountRef.current.removeChild(dom);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[460px] flex items-center justify-center">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Hover Tooltip Overlay per Brief Section 36 */}
      {hoveredNode && (
        <div
          style={{ left: `${tooltipPos.x + 12}px`, top: `${tooltipPos.y - 40}px` }}
          className="absolute z-30 pointer-events-none spatial-panel p-3.5 text-xs space-y-1 w-52 shadow-xl border border-[#2E2A27]"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-xs">{hoveredNode.name}</span>
            <span className={`spatial-badge ${
              hoveredNode.riskLevel === 'LOW' ? 'spatial-badge-verified' :
              hoveredNode.riskLevel === 'MEDIUM' ? 'spatial-badge-review' : 'spatial-badge-risk'
            }`}>
              {hoveredNode.riskLevel}
            </span>
          </div>

          <div className="flex justify-between text-[11px] text-[#94A3B8] font-mono pt-1">
            <span>Trust Score:</span>
            <span className="font-bold text-white">{hoveredNode.trustScore}/100</span>
          </div>

          <div className="flex justify-between text-[11px] text-[#94A3B8] font-mono">
            <span>Volume:</span>
            <span className="font-bold text-[#38BDF8]">{hoveredNode.volume}</span>
          </div>

          <div className="text-[10px] text-[#64748B] pt-1 border-t border-white/10 flex justify-between">
            <span>Class: {hoveredNode.type}</span>
            <span className="text-[#388BFD]">Click to Inspect</span>
          </div>
        </div>
      )}
    </div>
  );
};

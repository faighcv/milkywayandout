'use client';
import { useState } from 'react';
import type { InteractiveProps } from '@/types';

type PathNode = { id: string; label: string; sublabel?: string; color: string; x: number; y: number };
type PathEdge = { from: string; to: string; label?: string; minMass?: number; maxMass?: number };

const NODES: PathNode[] = [
  { id: 'cloud', label: 'Molecular Cloud', color: '#6366f1', x: 50, y: 8 },
  { id: 'protostar', label: 'Protostar', color: '#8b5cf6', x: 50, y: 20 },
  { id: 'ms_low', label: 'Main Sequence', sublabel: '(low mass)', color: '#10b981', x: 25, y: 34 },
  { id: 'ms_high', label: 'Main Sequence', sublabel: '(high mass)', color: '#3b82f6', x: 75, y: 34 },
  { id: 'rgb', label: 'Red Giant', sublabel: 'H shell burning', color: '#f97316', x: 25, y: 50 },
  { id: 'bsg', label: 'Blue → Red Supergiant', color: '#ef4444', x: 75, y: 50 },
  { id: 'agb', label: 'AGB Star', sublabel: 'He shell burning', color: '#fb923c', x: 25, y: 65 },
  { id: 'sn', label: 'Core-Collapse Supernova', color: '#fbbf24', x: 75, y: 65 },
  { id: 'pne', label: 'Planetary Nebula', color: '#a78bfa', x: 25, y: 79 },
  { id: 'wd', label: 'White Dwarf', sublabel: 'Electron degeneracy', color: '#818cf8', x: 25, y: 92 },
  { id: 'ns', label: 'Neutron Star', sublabel: 'Neutron degeneracy', color: '#60a5fa', x: 62, y: 79 },
  { id: 'bh', label: 'Black Hole', sublabel: 'M > 25 M☉', color: '#1e1b4b', x: 88, y: 79 },
];

const EDGES: PathEdge[] = [
  { from: 'cloud', to: 'protostar' },
  { from: 'protostar', to: 'ms_low', label: '< 8 M☉', maxMass: 8 },
  { from: 'protostar', to: 'ms_high', label: '≥ 8 M☉', minMass: 8 },
  { from: 'ms_low', to: 'rgb' },
  { from: 'ms_high', to: 'bsg' },
  { from: 'rgb', to: 'agb' },
  { from: 'bsg', to: 'sn' },
  { from: 'agb', to: 'pne' },
  { from: 'sn', to: 'ns', label: '8–25 M☉', maxMass: 25, minMass: 8 },
  { from: 'sn', to: 'bh', label: '> 25 M☉', minMass: 25 },
  { from: 'pne', to: 'wd' },
];

const NODE_MAP = Object.fromEntries(NODES.map(n => [n.id, n]));

const FACTS: Record<string, string> = {
  cloud: 'Cold (~10 K), dense region of interstellar medium. Gravity vs. thermal pressure — a perturbation tips the balance.',
  protostar: 'Collapsing clump heats up. Not yet fusing hydrogen. Located upper-right on HR diagram. Surrounded by accretion disk.',
  ms_low: 'Low-mass stars (< 8 M☉) fuse H in core. Our Sun will spend ~10 Gyr here. Higher mass = shorter MS lifetime (τ ∝ M/L ∝ M⁻²·⁵).',
  ms_high: 'High-mass stars (≥ 8 M☉) are luminous blue stars. Very short MS lifetimes (~millions of years). CNO cycle dominant.',
  rgb: 'Core H depleted → H shell burning → star expands and cools. Luminosity increases dramatically. Star leaves the main sequence.',
  bsg: 'Massive stars expand into supergiants. Multiple shell-burning stages (H, He, C, Ne, O, Si). "Onion" structure builds up.',
  agb: 'Asymptotic Giant Branch. He and H shells alternate burning. Star pulsates and ejects mass via stellar winds → planetary nebula.',
  sn: 'Iron core forms — fusion no longer produces energy. Core collapses in milliseconds. Outer layers are blasted away in a supernova (Type II).',
  pne: 'Ejected outer layers illuminated by the hot remnant core. Beautiful, short-lived (~10,000 yr). Returns enriched material to ISM.',
  wd: 'Remnant core of C and O. Supported by electron degeneracy pressure. Chandrasekhar limit: 1.4 M☉. Cools over billions of years.',
  ns: 'Supported by neutron degeneracy pressure. Incredibly dense (~1 teaspoon = billion tons). May appear as pulsar (rotating beams).',
  bh: 'Gravity overwhelms all pressure. Escape velocity exceeds c. Schwarzschild radius: r = 2GM/c². Stellar-mass BH from massive star death.',
};

export default function StellarLifePath(_: InteractiveProps) {
  const [mass, setMass] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);

  // Determine which nodes are active for given mass
  const activeNodes = new Set<string>();
  activeNodes.add('cloud');
  activeNodes.add('protostar');
  if (mass < 8) {
    activeNodes.add('ms_low');
    activeNodes.add('rgb');
    activeNodes.add('agb');
    activeNodes.add('pne');
    activeNodes.add('wd');
  } else {
    activeNodes.add('ms_high');
    activeNodes.add('bsg');
    activeNodes.add('sn');
    if (mass < 25) activeNodes.add('ns');
    else activeNodes.add('bh');
  }

  const activeEdges = EDGES.filter(e => {
    const minOk = e.minMass === undefined || mass >= e.minMass;
    const maxOk = e.maxMass === undefined || mass < e.maxMass;
    return activeNodes.has(e.from) && activeNodes.has(e.to) && minOk && maxOk;
  });

  const starType = mass < 0.5 ? 'Red Dwarf' : mass < 1.5 ? 'Sun-like (G)' : mass < 3 ? 'A/F Star' : mass < 8 ? 'B Star' : mass < 20 ? 'O Star' : 'Hypergiant';

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ color: '#a78bfa', fontSize: '16px', fontWeight: 700, margin: '0 0 4px' }}>
          Stellar Life Path — Evolution by Mass
        </h3>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
          A star's mass determines its entire life. Adjust mass to trace the evolutionary path.
          Click any stage to learn more.
        </p>
      </div>

      {/* Mass slider */}
      <div style={{ padding: '14px', borderRadius: '10px', marginBottom: '16px',
        background: 'rgba(13,13,43,0.8)', border: '1px solid rgba(167,139,250,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <label style={{ color: '#94a3b8', fontSize: '13px' }}>
            Star mass: <strong style={{ color: '#a78bfa' }}>{mass} M☉</strong>
          </label>
          <span style={{ color: '#fbbf24', fontSize: '13px', fontWeight: 700 }}>{starType}</span>
        </div>
        <input type="range" min="0.1" max="40" step="0.1" value={mass}
          onChange={e => setMass(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#a78bfa' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px',
          color: '#475569', marginTop: '4px' }}>
          <span>0.1 M☉ (red dwarf)</span>
          <span>1 M☉ (our Sun)</span>
          <span>40 M☉ (massive)</span>
        </div>
      </div>

      {/* SVG flow diagram */}
      <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 20%, #0d0d2b, #03030a)',
        border: '1px solid rgba(167,139,250,0.15)' }}>
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: 'auto' }}
          preserveAspectRatio="xMidYMid meet">

          {/* Edges */}
          {EDGES.map((e, i) => {
            const from = NODE_MAP[e.from];
            const to = NODE_MAP[e.to];
            const isActive = activeEdges.includes(e);
            return (
              <g key={i}>
                <line
                  x1={from.x} y1={from.y + 2.5} x2={to.x} y2={to.y - 2.5}
                  stroke={isActive ? from.color : 'rgba(71,85,105,0.3)'}
                  strokeWidth={isActive ? 0.6 : 0.3}
                  strokeDasharray={isActive ? 'none' : '1 1'}
                  opacity={isActive ? 0.8 : 0.4}
                />
                {e.label && isActive && (
                  <text
                    x={(from.x + to.x) / 2 + 1} y={(from.y + to.y) / 2 + 0.5}
                    fill={from.color} fontSize="2.2" textAnchor="middle" opacity="0.9">
                    {e.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {NODES.map(node => {
            const isActive = activeNodes.has(node.id);
            const isSel = selected === node.id;
            return (
              <g key={node.id} style={{ cursor: 'pointer' }}
                onClick={() => setSelected(selected === node.id ? null : node.id)}>
                <circle cx={node.x} cy={node.y} r={isSel ? 4.5 : 3.8}
                  fill={isActive ? `${node.color}22` : 'rgba(13,13,43,0.5)'}
                  stroke={isActive ? node.color : '#334155'}
                  strokeWidth={isSel ? 0.8 : 0.4}
                  opacity={isActive ? 1 : 0.35} />
                <text x={node.x} y={node.y + 0.5} textAnchor="middle"
                  fill={isActive ? node.color : '#475569'} fontSize="2.2" fontWeight="bold"
                  opacity={isActive ? 1 : 0.4}>
                  {node.label}
                </text>
                {node.sublabel && (
                  <text x={node.x} y={node.y + 2.8} textAnchor="middle"
                    fill={isActive ? `${node.color}aa` : '#334155'} fontSize="1.8"
                    opacity={isActive ? 1 : 0.3}>
                    {node.sublabel}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Detail panel */}
      {selected && FACTS[selected] && (
        <div style={{ marginTop: '12px', padding: '16px', borderRadius: '12px',
          background: `${NODE_MAP[selected].color}0f`,
          border: `1px solid ${NODE_MAP[selected].color}35` }}>
          <h4 style={{ margin: '0 0 8px', color: NODE_MAP[selected].color, fontSize: '15px', fontWeight: 700 }}>
            {NODE_MAP[selected].label}
            {NODE_MAP[selected].sublabel && <span style={{ fontWeight: 400, fontSize: '13px', marginLeft: '8px', opacity: 0.7 }}>{NODE_MAP[selected].sublabel}</span>}
          </h4>
          <p style={{ margin: 0, color: '#cbd5e1', fontSize: '13px', lineHeight: '1.7' }}>
            {FACTS[selected]}
          </p>
        </div>
      )}

      {!selected && (
        <div style={{ marginTop: '12px', padding: '12px', borderRadius: '10px',
          background: 'rgba(13,13,43,0.6)', border: '1px dashed rgba(148,163,184,0.15)',
          color: '#475569', fontSize: '13px', textAlign: 'center' }}>
          ↑ Click any stage to see details
        </div>
      )}

      <div style={{ marginTop: '10px', padding: '12px', borderRadius: '8px',
        background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.2)' }}>
        <p style={{ margin: 0, fontSize: '12px', color: '#c4b5fd', lineHeight: '1.6' }}>
          <strong>Mass-Lifetime Rule:</strong> τ ≈ (M/M☉) / (L/L☉) × 10 Gyr.
          Since L ∝ M⁴, lifetime ∝ M⁻³. A 10 M☉ star lives ~1000× shorter than the Sun.
          "Live fast, die young" — massive stars enrich the ISM with heavy elements quickly.
        </p>
      </div>
    </div>
  );
}

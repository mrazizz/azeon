import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useColorMode } from '@docusaurus/theme-common';

const NODES = [
  { id: 'sat',     label: 'SAT',            subtitle: 'Cook-Levin, 1971', x: 250, y: 52,  w: 120, root: true  },
  { id: '3sat',    label: '3-SAT',          subtitle: 'Post 14',          x: 138, y: 148, w: 88,  root: false },
  { id: 'circuit', label: 'Circuit-SAT',    subtitle: 'variant',          x: 382, y: 148, w: 118, root: false, dim: true },
  { id: 'clique',  label: 'Clique',         subtitle: 'Post 15',          x: 72,  y: 248, w: 88,  root: false },
  { id: 'indset',  label: 'Ind. Set',       subtitle: 'Post 17',          x: 202, y: 248, w: 88,  root: false },
  { id: 'vc',      label: 'Vertex Cover',   subtitle: 'Post 16',          x: 138, y: 345, w: 118, root: false },
  { id: 'gc',      label: 'Graph Coloring', subtitle: 'Post 18',          x: 138, y: 432, w: 128, root: false },
  
  // Moved to the right side
  { id: 'hc',      label: 'Ham. Cycle',     subtitle: 'Post 19',          x: 310, y: 345, w: 110, root: false },
  { id: 'tsp',     label: 'TSP',            subtitle: 'Post 20',          x: 310, y: 432, w: 88,  root: false },
];

const EDGES = [
  // Existing vertical/diagonal reductions
  ['sat',    '3sat'],
  ['sat',    'circuit'],
  ['3sat',   'clique'],
  ['3sat',   'indset'],
  ['clique', 'vc'],
  ['indset', 'vc'],
  ['vc',     'gc'],
  
  // Horizontal reductions to the right
  ['vc',     'hc'],
  ['gc',     'tsp'],
];

const H = 34;

function getNode(id) {
  return NODES.find(n => n.id === id);
}

function edgePath(src, tgt, isDim = false) {
  // If the nodes are on the same vertical Y level (horizontal line)
  if (Math.abs(src.y - tgt.y) < 10) {
    const isLeftToRight = src.x < tgt.x;
    const x1 = isLeftToRight ? src.x + src.w / 2 : src.x - src.w / 2;
    const y1 = src.y;
    const x2 = isLeftToRight ? tgt.x - tgt.w / 2 : tgt.x + tgt.w / 2;
    const y2 = tgt.y;
    
    // Stop 5px early so the arrowhead tip lands perfectly on the border.
    let xEnd = x2;
    if (!isDim) {
       xEnd = isLeftToRight ? x2 - 5 : x2 + 5;
    }
    
    return `M ${x1} ${y1} L ${xEnd} ${y2}`;
  } 
  // Otherwise, use the standard vertical/curved path
  else {
    const x1 = src.x;
    const y1 = src.y + H / 2;
    const x2 = tgt.x;
    const y2 = tgt.y - H / 2;
    const cy = (y1 + y2) / 2;
    const yEnd = isDim ? y2 : y2 - 5;
    
    return `M ${x1} ${y1} 
            L ${x1} ${y1 + 4} 
            C ${x1} ${cy}, ${x2} ${cy}, ${x2} ${y2 - 12} 
            L ${x2} ${yEnd}`;
  }
}

function Inner() {
  const { colorMode } = useColorMode();
  const dark = colorMode === 'dark';

  const accent       = dark ? '#a67cff' : '#5e35b1';
  const accentDim    = dark ? 'rgba(166,124,255,0.18)' : 'rgba(94,53,177,0.10)';
  const accentBorder = dark ? 'rgba(166,124,255,0.55)' : 'rgba(94,53,177,0.45)';
  const nodeBg       = dark ? '#0f0f0f' : '#ffffff';
  const nodeBorder   = dark ? '#2f3336' : 'rgba(94,53,177,0.20)';
  const textPri      = dark ? '#e7e9ea' : '#0d0a1a';
  const textMut      = dark ? 'rgba(231,233,234,0.42)' : 'rgba(13,10,26,0.40)';
  const edgeColor    = dark ? '#a67cff' : '#5e35b1'; 
  
  const bgCard       = dark ? '#000000' : '#fafafa';
  const borderCard   = dark ? '#1e2124' : 'rgba(94,53,177,0.12)';
  const mono         = 'var(--ifm-font-family-monospace)';
  const serif        = 'var(--ifm-heading-font-family)';

  return (
    <div style={{
      background: bgCard,
      border: `1px solid ${borderCard}`,
      borderRadius: 16,
      padding: '1.25rem 1rem 1rem',
      margin: '1.75rem 0',
      fontFamily: mono,
    }}>
      <div style={{
        fontSize: '0.58rem',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: dark ? 'rgba(166,124,255,0.5)' : 'rgba(94,53,177,0.5)',
        textAlign: 'center',
        marginBottom: '0.85rem',
      }}>
        // NP-Completeness Reduction Chain
      </div>

      <svg
        viewBox="0 0 500 476"
        style={{ width: '100%', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id={`arrow-${dark ? 'd' : 'l'}`}
            markerWidth="14"
            markerHeight="14"
            refX="6"
            refY="7"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path
              d="M 1 3 L 11 7 L 1 11 z"
              fill={edgeColor}
            />
          </marker>
        </defs>

        {EDGES.map(([srcId, tgtId]) => {
          const src = getNode(srcId);
          const tgt = getNode(tgtId);
          const dim = src.dim || tgt.dim;
          return (
            <path
              key={`${srcId}-${tgtId}`}
              d={edgePath(src, tgt, dim)}
              fill="none"
              stroke={dim ? 'rgba(100,100,100,0.4)' : edgeColor}
              strokeWidth={dim ? 1 : 1.5}
              strokeDasharray={dim ? '5 3' : 'none'}
              markerEnd={dim ? undefined : `url(#arrow-${dark ? 'd' : 'l'})`}
            />
          );
        })}

        {NODES.map((node) => {
          const rx = node.x - node.w / 2;
          const ry = node.y - H / 2;
          const isRoot = node.root;
          const isDim  = node.dim;

          return (
            <g key={node.id}>
              <rect
                x={rx}
                y={ry}
                width={node.w}
                height={H}
                rx={8}
                fill={isRoot ? accentDim : (isDim ? 'transparent' : nodeBg)}
                stroke={isRoot ? accent : (isDim ? 'rgba(120,120,120,0.22)' : nodeBorder)}
                strokeWidth={isRoot ? 1.5 : 1}
              />
              <text
                x={node.x}
                y={node.y - 4}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isDim ? textMut : (isRoot ? accent : textPri)}
                fontSize={isRoot ? 13 : 12}
                fontFamily={serif}
                fontWeight={isRoot ? '400' : '400'}
                style={{ letterSpacing: isRoot ? '-0.01em' : '0' }}
              >
                {node.label}
              </text>
              <text
                x={node.x}
                y={node.y + 10}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isDim ? 'rgba(120,120,120,0.3)' : textMut}
                fontSize={8.5}
                fontFamily={mono}
                style={{ letterSpacing: '0.05em' }}
              >
                {node.subtitle}
              </text>
            </g>
          );
        })}
      </svg>

      <div style={{
        display: 'flex',
        gap: 16,
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: '0.6rem',
      }}>
        {[
          { fill: accentDim, border: accent, label: 'Starting point (this post)' },
          { fill: nodeBg,    border: nodeBorder, label: 'NP-Complete (upcoming posts)' },
          { fill: 'transparent', border: 'rgba(120,120,120,0.22)', label: 'Variant / not covered directly' },
        ].map(({ fill, border, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 28, height: 14,
              background: fill,
              border: `1px solid ${border}`,
              borderRadius: 4,
              flexShrink: 0,
            }} />
            <span style={{ fontSize: '0.58rem', letterSpacing: '0.06em', color: textMut }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NPReductionChain() {
  return (
    <BrowserOnly fallback={
      <div style={{
        height: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.4,
        fontFamily: 'monospace',
        fontSize: '0.8rem',
      }}>
        Loading diagram...
      </div>
    }>
      {() => <Inner />}
    </BrowserOnly>
  );
}
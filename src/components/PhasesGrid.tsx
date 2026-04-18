import React, { useState } from 'react';
import Link from '@docusaurus/Link';

const PHASES = [
  {
    num: '01',
    title: 'Foundations',
    slug: '/p-vs-np/foundations',
    color: 'var(--az-phase-01)',
    desc: 'Algorithms, Turing machines, Big-O notation, and the formal definitions of P and NP.',
    publishedPosts: 10,
    totalPosts: 10,
  },
  {
    num: '02',
    title: 'NP-Completeness',
    slug: '/p-vs-np/np-completeness',
    color: 'var(--az-phase-02)',
    desc: 'Reductions, Cook-Levin theorem, SAT, TSP, Graph Coloring, Sudoku, and the NP-Complete zoo.',
    publishedPosts: 4,
    totalPosts: 14,
  },
  {
    num: '03',
    title: 'Complexity Zoo',
    slug: '/p-vs-np/complexity-zoo',
    color: 'var(--az-phase-03)',
    desc: "coNP, PSPACE, EXP, randomized algorithms, quantum computing, and Shor's algorithm.",
    publishedPosts: 0,
    totalPosts: 10,
  },
  {
    num: '04',
    title: 'Failed Proofs',
    slug: '/p-vs-np/failed-proofs',
    color: 'var(--az-phase-04)',
    desc: 'Relativization, Natural Proofs, Algebrization, GCT — every barrier that blocks a proof.',
    publishedPosts: 0,
    totalPosts: 16,
  },
  {
    num: '05',
    title: 'Real-World Impact',
    slug: '/p-vs-np/real-world-impact',
    color: 'var(--az-phase-05)',
    desc: 'RSA encryption, supply chains, protein folding, AI, and the cost of NP-Hardness.',
    publishedPosts: 0,
    totalPosts: 12,
  },
  {
    num: '06',
    title: 'Heuristics',
    slug: '/p-vs-np/heuristics',
    color: 'var(--az-phase-06)',
    desc: 'Approximation algorithms, greedy strategies, simulated annealing, and genetic algorithms.',
    publishedPosts: 0,
    totalPosts: 12,
  },
  {
    num: '07',
    title: 'Final Verdict',
    slug: '/p-vs-np/final-verdict',
    color: 'var(--az-phase-07)',
    desc: 'The scientific consensus, the consequences of both outcomes, open research, and what comes next.',
    publishedPosts: 0,
    totalPosts: 6,
  },
];

const TOTAL_PUBLISHED = PHASES.reduce((s, p) => s + p.publishedPosts, 0);
const TOTAL_PLANNED   = PHASES.reduce((s, p) => s + p.totalPosts,     0);

function PhaseCard({ phase }) {
  const [hovered, setHovered] = useState(false);
  const isLive = phase.publishedPosts > 0;

  return (
    <Link
      to={isLive ? phase.slug : '#'}
      className={'az-phase-card' + (!isLive ? ' az-phase-card--locked' : '')}
      style={{
        borderColor: hovered && isLive ? phase.color : undefined,
        boxShadow: hovered && isLive
          ? `0 0 28px ${phase.color}22, inset 0 0 28px ${phase.color}06`
          : undefined,
        cursor: isLive ? 'pointer' : 'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={e => { if (!isLive) e.preventDefault(); }}
    >
      <div className="az-phase-card__top">
        <span
          className="az-phase-card__num"
          style={{ color: hovered && isLive ? phase.color : undefined }}
        >
          {phase.num}
        </span>
        <span className={'az-phase-card__badge' + (isLive ? ' az-phase-card__badge--live' : '')}>
          {isLive && <span className="az-phase-card__badge-dot" />}
          {isLive ? `${phase.publishedPosts} / ${phase.totalPosts} posts` : 'Coming soon'}
        </span>
      </div>
      <h3 className="az-phase-card__title">{phase.title}</h3>
      <p className="az-phase-card__desc">{phase.desc}</p>
      {isLive
        ? <span className="az-phase-card__link" style={{ color: hovered ? phase.color : undefined }}>Read phase →</span>
        : <span className="az-phase-card__link az-phase-card__link--soon">In progress</span>
      }
    </Link>
  );
}

export default function PhasesGrid() {
  return (
    <div style={{ margin: '0 0 2rem' }}>

      <div className="az-featured__meta" style={{ justifyContent: 'flex-start', marginBottom: '2rem' }}>
        <span className="az-featured__pill az-featured__pill--live">● Live</span>
        <span className="az-featured__pill">{TOTAL_PUBLISHED} of {TOTAL_PLANNED} posts published</span>
        <span className="az-featured__pill">7 phases</span>
        <span className="az-featured__pill">$1,000,000 prize</span>
      </div>

      <div className="az-phases__grid">
        {PHASES.map(phase => (
          <PhaseCard key={phase.num} phase={phase} />
        ))}
      </div>

      <div className="az-featured__cta" style={{ justifyContent: 'flex-start', marginTop: '2.5rem' }}>
        <Link
          to="/p-vs-np/foundations/introduction-to-the-millennium-prize"
          className="az-btn az-btn--accent"
        >
          Start with Post #1
        </Link>
        <Link to="/p-vs-np/foundations" className="az-btn az-btn--ghost">
          Browse Phase 1
        </Link>
      </div>

    </div>
  );
}

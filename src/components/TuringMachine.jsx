import React, { useState, useRef } from 'react';

const RULES = [
  { mode: 'Checking', read: '1', write: '1', next: 'Checking', dir: 'Right' },
  { mode: 'Checking', read: '_', write: '_', next: 'Accept', dir: 'Stay' },
  { mode: 'Checking', read: '0', write: '0', next: 'Reject', dir: 'Stay' },
];

const INIT_TAPE = ['1', '1', '0', '1', '_', '_', '_'];
const VISIBLE = 7;
const CELL = 52;

function init() {
  return { tape: [...INIT_TAPE], head: 0, mode: 'Checking', history: [], log: 'Press Step → to begin.' };
}

function stepState(s) {
  if (s.mode === 'Accept' || s.mode === 'Reject') return s;
  const sym = s.tape[s.head] ?? '_';
  const rule = RULES.find(r => r.mode === s.mode && r.read === sym);
  if (!rule) return { ...s, log: 'No matching rule — halted.' };
  const tape = [...s.tape];
  tape[s.head] = rule.write;
  let head = s.head;
  if (rule.dir === 'Right') head++;
  if (rule.dir === 'Left') head = Math.max(0, head - 1);
  if (head >= tape.length) tape.push('_');
  return {
    tape, head, mode: rule.next,
    history: [...s.history, { tape: s.tape, head: s.head, mode: s.mode }],
    log: `Read "${rule.read}" → write "${rule.write}", switch to ${rule.next}, move ${rule.dir}.`,
  };
}

function undoState(s) {
  if (!s.history.length) return s;
  const p = s.history[s.history.length - 1];
  return { tape: [...p.tape], head: p.head, mode: p.mode, history: s.history.slice(0, -1), log: 'Stepped back.' };
}

export default function TuringMachine() {
  const [s, set] = useState(init);
  const [running, setR] = useState(false);
  const ref = useRef(null);
  const done = s.mode === 'Accept' || s.mode === 'Reject';

  const reset = () => { clearInterval(ref.current); setR(false); set(init()); };
  const doStep = () => set(stepState);
  const doBack = () => set(undoState);
  const toggleRun = () => {
    if (running) { clearInterval(ref.current); setR(false); return; }
    setR(true);
    ref.current = setInterval(() => {
      set(prev => {
        if (prev.mode === 'Accept' || prev.mode === 'Reject') {
          clearInterval(ref.current); setR(false); return prev;
        }
        return stepState(prev);
      });
    }, 650);
  };

  const start = Math.max(0, s.head - 3);
  const cells = Array.from({ length: VISIBLE }, (_, i) => {
    const idx = start + i;
    return { idx, sym: s.tape[idx] ?? '_', active: idx === s.head, first: i === 0, last: i === VISIBLE - 1 };
  });

  /* ── design tokens ── */
  const mono = 'var(--ifm-font-family-monospace)';
  const accent = 'var(--az-accent)';
  const acDim = 'var(--az-accent-dim)';
  const primary = 'var(--az-primary)';
  const bgBase = 'var(--az-bg-base)';
  const bgSurf = 'var(--az-bg-surface)';
  const tPri = 'var(--az-text-primary)';
  const tMuted = 'var(--az-text-muted)';
  const bdr = 'var(--az-border)';
  const bdrS = 'var(--az-border-subtle)';

  const modeBg = s.mode === 'Accept' ? 'rgba(76,175,80,0.12)' : s.mode === 'Reject' ? 'rgba(200,80,80,0.12)' : bgBase;
  const modeBdr = s.mode === 'Accept' ? 'rgba(76,175,80,0.4)' : s.mode === 'Reject' ? 'rgba(200,80,80,0.4)' : bdr;
  const modeClr = s.mode === 'Accept' ? '#2e7d32' : s.mode === 'Reject' ? '#c85555' : tPri;

  return (
    <div style={{ fontFamily: mono, background: bgSurf, border: `1px solid ${bdr}`, borderRadius: 16, padding: '1.5rem', margin: '2rem 0' }}>

      {/* ── Tape + head ── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 6, marginBottom: '1.5rem' }}>

        <span style={{ fontSize: 16, color: tMuted, paddingBottom: CELL / 2 - 10 }}>...</span>

        {cells.map(({ idx, sym, active, first, last }) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: CELL }}>

            {/* head pin — occupies space always, visible only when active */}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              height: 46, justifyContent: 'flex-end', marginBottom: 3,
              opacity: active ? 1 : 0, transition: 'opacity 0.2s',
            }}>
              <span style={{
                background: primary, color: '#fff',
                fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: '3px 10px', borderRadius: 5, fontWeight: 500,
                marginBottom: 3, whiteSpace: 'nowrap',
              }}>Head</span>
              <span style={{ fontSize: 18, color: primary, lineHeight: 1 }}>↓</span>
            </div>

            {/* cell — every cell has all four borders; overlap via negative left margin */}
            <div style={{
              width: CELL, height: CELL,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 500,
              color: active ? accent : tPri,
              background: active ? acDim : bgBase,
              border: `1px solid ${active ? accent : bdrS}`,
              marginLeft: first ? 0 : -1,
              borderRadius:
                first && last ? 8 :
                  first ? '8px 0 0 8px' :
                    last ? '0 8px 8px 0' : 0,
              position: 'relative',
              zIndex: active ? 1 : 0,
              transition: 'all 0.22s',
            }}>
              {sym === '_' ? '' : sym}
            </div>
          </div>
        ))}

        <span style={{ fontSize: 16, color: tMuted, paddingBottom: CELL / 2 - 10 }}>...</span>
      </div>

      {/* ── Mode badge ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: '1.5rem' }}>
        <span style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: tMuted }}>Current mode</span>
        <span style={{
          fontSize: 14, fontWeight: 500, padding: '5px 24px', borderRadius: 999,
          border: `1px solid ${modeBdr}`, background: modeBg, color: modeClr,
          transition: 'all 0.25s',
        }}>{s.mode}</span>
      </div>

      {/* ── Controls ── */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {[
          { label: '↺ Reset', onClick: reset, disabled: false, isPrimary: false },
          { label: '← Back', onClick: doBack, disabled: !s.history.length, isPrimary: false },
          { label: 'Step →', onClick: doStep, disabled: done, isPrimary: true },
          { label: running ? '⏸ Pause' : '▶ Run', onClick: toggleRun, disabled: done, isPrimary: false },
        ].map(({ label, onClick, disabled, isPrimary }) => (
          <button key={label} onClick={onClick} disabled={disabled} style={{
            fontFamily: mono, fontSize: 12, letterSpacing: '0.04em',
            padding: '7px 18px', borderRadius: 10,
            cursor: disabled ? 'default' : 'pointer',
            border: `1px solid ${isPrimary ? primary : bdr}`,
            background: isPrimary ? primary : bgBase,
            color: isPrimary ? '#fff' : tPri,
            opacity: disabled ? 0.35 : 1,
            transition: 'all 0.15s',
          }}>{label}</button>
        ))}
      </div>

      {/* ── Log ── */}
      <div style={{ fontSize: 12, color: tMuted, textAlign: 'center', minHeight: 18, lineHeight: 1.5 }}>
        {s.log}
      </div>

    </div>
  );
}
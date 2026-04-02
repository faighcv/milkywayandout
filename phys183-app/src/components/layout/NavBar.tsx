'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProgressStore } from '@/store/progressStore';

const LINKS = [
  { href: '/', label: 'Galaxy Map' },
  { href: '/review', label: 'Review' },
  { href: '/test', label: 'Test' },
  { href: '/glossary', label: 'Glossary' },
];

function ProgressRing({ pct }: { pct: number }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(124,58,237,0.2)" strokeWidth="3" />
      <circle
        cx="22" cy="22" r={r} fill="none"
        stroke="#7c3aed" strokeWidth="3"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.5s ease' }}
      />
      <text
        x="22" y="22"
        textAnchor="middle" dominantBaseline="central"
        fill="#e2e8f0" fontSize="9" fontWeight="bold"
        style={{ transform: 'rotate(90deg)', transformOrigin: '22px 22px' }}
      >
        {Math.round(pct * 100)}%
      </text>
    </svg>
  );
}

export default function NavBar() {
  const pathname = usePathname();
  const getOverallCompletion = useProgressStore(s => s.getOverallCompletion);
  const pct = getOverallCompletion();

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(6,6,20,0.85)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(124,58,237,0.25)',
      height: '64px', display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: '32px',
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <span style={{ fontSize: '20px' }}>✦</span>
        <span style={{
          fontWeight: 700, letterSpacing: '0.1em', fontSize: '16px',
          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>PHYS183</span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
        {LINKS.map(({ href, label }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link key={href} href={href} style={{
              padding: '6px 16px', borderRadius: '8px', fontSize: '14px',
              fontWeight: active ? 600 : 400,
              color: active ? '#06b6d4' : '#94a3b8',
              background: active ? 'rgba(6,182,212,0.1)' : 'transparent',
              border: active ? '1px solid rgba(6,182,212,0.3)' : '1px solid transparent',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}>
              {label}
            </Link>
          );
        })}
      </div>

      {/* Progress Ring */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '11px', color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Progress
        </span>
        <ProgressRing pct={pct} />
      </div>
    </nav>
  );
}

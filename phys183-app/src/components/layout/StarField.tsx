'use client';
import React from 'react';

const STARS = Array.from({ length: 150 }, (_, i) => ({
  id: i,
  x: (((i * 137.508) % 100) + 100) % 100,
  y: (((i * 97.3) % 100) + 100) % 100,
  size: 0.5 + ((i * 0.37) % 2),
  dur: 2 + ((i * 0.41) % 4),
  opacity: 0.3 + ((i * 0.13) % 0.7),
}));

export default function StarField() {
  return (
    <div className="star-field" aria-hidden="true">
      {STARS.map(s => (
        <div
          key={s.id}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            ['--dur' as string]: `${s.dur}s`,
          }}
        />
      ))}
    </div>
  );
}

'use client';
import dynamic from 'next/dynamic';
import type { Lecture } from '@/types';
import type { InteractiveComponentKey, InteractiveProps } from '@/types';

const REGISTRY: Partial<Record<InteractiveComponentKey, React.ComponentType<InteractiveProps>>> = {
  SpaceZoom:          dynamic(() => import('@/components/interactive/SpaceZoom'), { ssr: false }),
  AstronomyTimeline:  dynamic(() => import('@/components/interactive/AstronomyTimeline'), { ssr: false }),
  EMSpectrumExplorer: dynamic(() => import('@/components/interactive/EMSpectrumExplorer'), { ssr: false }),
  BlackbodySlider:    dynamic(() => import('@/components/interactive/BlackbodySlider'), { ssr: false }),
  TelescopeRayTrace:  dynamic(() => import('@/components/interactive/TelescopeRayTrace'), { ssr: false }),
  OrbitalAnimation:   dynamic(() => import('@/components/interactive/OrbitalAnimation'), { ssr: false }),
  NebularCondensation:dynamic(() => import('@/components/interactive/NebularCondensation'), { ssr: false }),
  PlanetCutaway:      dynamic(() => import('@/components/interactive/PlanetCutaway'), { ssr: false }),
  GreenhouseEffect:   dynamic(() => import('@/components/interactive/GreenhouseEffect'), { ssr: false }),
  JovianComparison:   dynamic(() => import('@/components/interactive/JovianComparison'), { ssr: false }),
  TransitLightCurve:  dynamic(() => import('@/components/interactive/TransitLightCurve'), { ssr: false }),
  RadialVelocity:     dynamic(() => import('@/components/interactive/RadialVelocity'), { ssr: false }),
  SolarStructure:     dynamic(() => import('@/components/interactive/SolarStructure'), { ssr: false }),
  ParallaxDemo:       dynamic(() => import('@/components/interactive/ParallaxDemo'), { ssr: false }),
  HRDiagram:          dynamic(() => import('@/components/interactive/HRDiagram'), { ssr: false }),
  StarFormation:      dynamic(() => import('@/components/interactive/StarFormation'), { ssr: false }),
  StellarLifePath:    dynamic(() => import('@/components/interactive/StellarLifePath'), { ssr: false }),
  CompactObjects:     dynamic(() => import('@/components/interactive/CompactObjects'), { ssr: false }),
};

export default function InteractiveContent({ lecture }: { lecture: Lecture }) {
  const Component = REGISTRY[lecture.interactiveComponent];
  if (!Component) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#475569', borderRadius: '14px',
        background: 'rgba(13,13,43,0.6)', border: '1px dashed rgba(148,163,184,0.2)' }}>
        Interactive simulation loading…
      </div>
    );
  }
  return <Component lectureId={lecture.id} />;
}

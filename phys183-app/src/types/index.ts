export type LectureId = 1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18;
export type TabKey = 'bigPicture'|'content'|'flashCards'|'quiz'|'summary'|'connections';
export type QuestionType = 'mcq'|'true-false'|'ordering';
export type FeedbackMode = 'immediate'|'delayed';

export interface PlanetStyle {
  color: string;
  glowColor: string;
  size: 'sm'|'md'|'lg';
  rings: boolean;
}

export interface SummarySection {
  heading: string;
  bullets: string[];
}

export interface FlashCard {
  id: string;
  lectureId: LectureId;
  front: string;
  back: string;
  tags: string[];
  difficulty: 1|2|3;
}

export interface QuizQuestion {
  id: string;
  lectureId: LectureId;
  type: QuestionType;
  prompt: string;
  choices?: string[];
  correctAnswer: string|string[];
  explanation: string;
  tags: string[];
  difficulty: 1|2|3;
}

export type InteractiveComponentKey =
  |'SpaceZoom'|'AstronomyTimeline'|'EMSpectrumExplorer'|'BlackbodySlider'
  |'TelescopeRayTrace'|'OrbitalAnimation'|'NebularCondensation'|'PlanetCutaway'
  |'GreenhouseEffect'|'JovianComparison'|'TransitLightCurve'|'RadialVelocity'
  |'SolarStructure'|'ParallaxDemo'|'HRDiagram'|'StarFormation'
  |'StellarLifePath'|'CompactObjects';

export interface Lecture {
  id: LectureId;
  slug: string;
  title: string;
  subtitle: string;
  bigPicture: string;
  keyQuestions: string[];
  commonConfusions: string[];
  prerequisites: LectureId[];
  connects: LectureId[];
  mapPosition: { x: number; y: number };
  planetStyle: PlanetStyle;
  summary: SummarySection[];
  flashCards: FlashCard[];
  quiz: QuizQuestion[];
  interactiveComponent: InteractiveComponentKey;
  glossaryTerms: string[];
  examTips: string[];
  memoryTricks: string[];
}

export interface LectureProgress {
  lectureId: LectureId;
  visited: boolean;
  tabsCompleted: TabKey[];
  flashCardsMastered: string[];
  quizBestScore: number;
  lastVisited: number;
}

export interface WeakTopic {
  tag: string;
  lectureIds: LectureId[];
  incorrectCount: number;
  totalAttempts: number;
}

export interface TestSession {
  sessionId: string;
  timestamp: number;
  questionIds: string[];
  answers: Record<string, string|string[]>;
  score: number;
  durationMs: number;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
  lectureIds: LectureId[];
  relatedTerms: string[];
}

export interface InteractiveProps {
  lectureId: LectureId;
  onInteractionComplete?: () => void;
}

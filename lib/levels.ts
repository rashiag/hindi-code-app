export type AgeGroup = 'junior' | 'intermediate' | 'senior';

export interface Level {
  id: number;
  ageGroup: AgeGroup;
  title: string;
  concept: string;
  instruction: string;
  voiceText: string;
  hint: string;
  gridSize: number;
  startPos: { x: number; y: number };
  startDir: 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';
  targets: { x: number; y: number }[];
  obstacles: { x: number; y: number }[];
  allowedBlocks: {
    moveForward?: boolean;
    turnLeft?: boolean;
    turnRight?: boolean;
    collectItem?: boolean;
    repeat?: boolean;
    condition?: boolean;
  };
  optimalBlocks: number;
}

export const LEVELS: Level[] = [
  // --- JUNIOR TRACK (Ages 5-7): Sequence & Basic Turns ---
  {
    id: 1,
    ageGroup: 'junior',
    title: 'स्तर 1: सीधी रेखा',
    concept: 'क्रमबद्धता (Sequence)',
    instruction: 'बंदर को सीधा आगे बढ़ाकर केला उठाएं।',
    voiceText: 'बंदर को आगे ले जाएं और केला उठाएं।',
    hint: '2 बार "आगे बढ़ो" और "केला उठाओ" लगाएं।',
    gridSize: 5,
    startPos: { x: 1, y: 2 },
    startDir: 'EAST',
    targets: [{ x: 3, y: 2 }],
    obstacles: [],
    allowedBlocks: { moveForward: true, collectItem: true },
    optimalBlocks: 3,
  },
  {
    id: 2,
    ageGroup: 'junior',
    title: 'स्तर 2: दायाँ मोड़',
    concept: 'दिशा ज्ञान (Right Turn)',
    instruction: 'आगे बढ़ें और केला लेने के लिए दाएँ मुड़ें।',
    voiceText: 'आगे बढ़ें और दाएँ मुड़ें।',
    hint: 'आगे बढ़ो, दाएँ मुड़ो, आगे बढ़ो और केला उठाओ।',
    gridSize: 5,
    startPos: { x: 1, y: 1 },
    startDir: 'EAST',
    targets: [{ x: 2, y: 3 }],
    obstacles: [],
    allowedBlocks: { moveForward: true, turnRight: true, collectItem: true },
    optimalBlocks: 5,
  },

  // --- INTERMEDIATE TRACK (Ages 8-10): Loops & Multi-step Patterns ---
  {
    id: 3,
    ageGroup: 'intermediate',
    title: 'स्तर 3: लूप का जादू',
    concept: 'दोहराव (Repeat Loops)',
    instruction: '5 कदम चलने के लिए दोहराव ब्लॉक (Loop) का प्रयोग करें।',
    voiceText: 'दोहराव लूप का प्रयोग करें।',
    hint: '"🔁 बार दोहराओ" में संख्या 5 डालें।',
    gridSize: 7,
    startPos: { x: 0, y: 3 },
    startDir: 'EAST',
    targets: [{ x: 5, y: 3 }],
    obstacles: [],
    allowedBlocks: { moveForward: true, collectItem: true, repeat: true },
    optimalBlocks: 3,
  },
  {
    id: 4,
    ageGroup: 'intermediate',
    title: 'स्तर 4: सीढ़ीनुमा सफर',
    concept: 'पैटर्न लूप (Pattern Loops)',
    instruction: 'सीढ़ी जैसे रास्ते को दोहराव ब्लॉक में डालकर हल करें।',
    voiceText: 'सीढ़ीदार पैटर्न को दोहराएं।',
    hint: 'लूप में [आगे, बाएँ, आगे, दाएँ] रखें।',
    gridSize: 7,
    startPos: { x: 1, y: 5 },
    startDir: 'EAST',
    targets: [{ x: 5, y: 1 }],
    obstacles: [{ x: 1, y: 4 }, { x: 2, y: 3 }, { x: 3, y: 2 }],
    allowedBlocks: { moveForward: true, turnLeft: true, turnRight: true, collectItem: true, repeat: true },
    optimalBlocks: 6,
  },

  // --- SENIOR TRACK (Ages 11+): Conditions & Logic ---
  {
    id: 5,
    ageGroup: 'senior',
    title: 'स्तर 5: अगर आगे पत्थर हो',
    concept: 'शर्त (If Condition)',
    instruction: 'शर्त ब्लॉक लगाएं: अगर पत्थर आए तो बाएँ मुड़ें!',
    voiceText: 'अगर आगे पत्थर हो तो बाएँ मुड़ें।',
    hint: '"❓ अगर आगे पत्थर हो" के अंदर "बाएँ मुड़ो" रखें।',
    gridSize: 7,
    startPos: { x: 1, y: 3 },
    startDir: 'EAST',
    targets: [{ x: 3, y: 1 }],
    obstacles: [{ x: 3, y: 3 }],
    allowedBlocks: { moveForward: true, turnLeft: true, turnRight: true, collectItem: true, condition: true },
    optimalBlocks: 5,
  },
  {
    id: 6,
    ageGroup: 'senior',
    title: 'स्तर 6: स्वचालित रोबोट (Loop + Condition)',
    concept: 'लूप के साथ शर्त (Loop with If)',
    instruction: 'लूप में आगे बढ़ें और पत्थर आने पर रास्ता बदलें।',
    voiceText: 'लूप और शर्त का एक साथ प्रयोग करें।',
    hint: 'लूप के अंदर "आगे बढ़ो" और "अगर पत्थर हो তো मुड़ो" दोनों लगाएं।',
    gridSize: 7,
    startPos: { x: 0, y: 2 },
    startDir: 'EAST',
    targets: [{ x: 5, y: 4 }],
    obstacles: [{ x: 3, y: 2 }],
    allowedBlocks: { moveForward: true, turnLeft: true, turnRight: true, collectItem: true, repeat: true, condition: true },
    optimalBlocks: 7,
  },
];
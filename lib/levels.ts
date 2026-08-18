export interface Coordinate {
  x: number;
  y: number;
}

export interface Level {
  id: number;
  title: string;
  concept: string;
  instruction: string;
  hint: string;
  voiceText: string;
  gridSize: number;
  startPos: Coordinate;
  startDir: 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';
  targets: Coordinate[];
  obstacles: Coordinate[];
  hasRepeatBlock?: boolean;
}

export const LEVELS: Level[] = [
  {
    id: 1,
    title: 'स्तर 1: पहला कदम',
    concept: 'क्रमबद्धता (Sequence)',
    instruction: 'बंदर को केला 🍌 तक पहुँचाने के लिए "आगे बढ़ो" ब्लॉक का उपयोग करें।',
    hint: 'केला 3 कदम की दूरी पर है। 3 बार "आगे बढ़ो" लगाएं और फिर "केला उठाओ" लगाएं।',
    voiceText: 'स्तर एक में आपका स्वागत है! आगे बढ़कर केला उठाइए।',
    gridSize: 8,
    startPos: { x: 1, y: 1 },
    startDir: 'EAST',
    targets: [{ x: 4, y: 1 }],
    obstacles: [],
    hasRepeatBlock: false,
  },
  {
    id: 2,
    title: 'स्तर 2: सही मोड़',
    concept: 'दिशा और मोड़ (Turns)',
    instruction: 'आगे बढ़ें, दाएँ मुड़ें और केला इकट्ठा करें।',
    hint: '2 कदम आगे बढ़ें, फिर दाएँ मुड़ें, 2 कदम आगे बढ़ें और केला उठाएं।',
    voiceText: 'स्तर दो! आगे बढ़ें और दाएँ मुड़कर फल प्राप्त करें।',
    gridSize: 8,
    startPos: { x: 1, y: 1 },
    startDir: 'EAST',
    targets: [{ x: 3, y: 3 }],
    obstacles: [],
    hasRepeatBlock: false,
  },
  {
    id: 3,
    title: 'स्तर 3: बाएँ और दाएँ',
    concept: 'एकाधिक मोड़ (Multiple Turns)',
    instruction: 'जिग-जैग रास्ते से होते हुए केले तक पहुंचें।',
    hint: 'आगे बढ़ें, बाएँ मुड़ें, आगे बढ़ें, फिर दाएँ मुड़कर आगे बढ़ें।',
    voiceText: 'स्तर तीन! बाएँ और दाएँ मुड़ने का सही क्रम बनाएं।',
    gridSize: 8,
    startPos: { x: 1, y: 4 },
    startDir: 'EAST',
    targets: [{ x: 4, y: 2 }],
    obstacles: [],
    hasRepeatBlock: false,
  },
  {
    id: 4,
    title: 'स्तर 4: दोहराव का जादू (Loop)',
    concept: 'लूप्स (Repeat Block)',
    instruction: '5 कदम चलने के लिए "दोहराओ" (Repeat) ब्लॉक का उपयोग करें।',
    hint: '"दोहराओ" ब्लॉक के अंदर "आगे बढ़ो" रखें और संख्या 5 सेट करें।',
    voiceText: 'स्तर चार! दोहराओ ब्लॉक का जादू सीखिए।',
    gridSize: 8,
    startPos: { x: 1, y: 1 },
    startDir: 'EAST',
    targets: [{ x: 6, y: 1 }],
    obstacles: [],
    hasRepeatBlock: true,
  },
  {
    id: 5,
    title: 'स्तर 5: पहली रुकावट',
    concept: 'रुकावट से बचना (Obstacle Avoidance)',
    instruction: 'रास्ते में पत्थर 🪨 है! उसके चारों ओर घूमकर केला प्राप्त करें।',
    hint: 'सीधे मत जाएं! पहले ऊपर या नीचे मुड़कर पत्थर से बचें।',
    voiceText: 'स्तर पांच! सावधान, रास्ते में पत्थर है।',
    gridSize: 8,
    startPos: { x: 1, y: 2 },
    startDir: 'EAST',
    targets: [{ x: 5, y: 2 }],
    obstacles: [{ x: 3, y: 2 }],
    hasRepeatBlock: true,
  },
  {
    id: 6,
    title: 'स्तर 6: दोहरे फल',
    concept: 'एकाधिक लक्ष्य (Multi-Target)',
    instruction: 'नक्शे पर दोनों केलों को क्रम से उठाएं।',
    hint: 'पहले पास वाले केले पर जाएं, फिर घूमकर दूसरे केले तक पहुंचें।',
    voiceText: 'स्तर छह! दोनों केलों को एक ही कोड से इकट्ठा करें।',
    gridSize: 8,
    startPos: { x: 1, y: 1 },
    startDir: 'EAST',
    targets: [{ x: 3, y: 1 }, { x: 3, y: 4 }],
    obstacles: [{ x: 2, y: 3 }],
    hasRepeatBlock: true,
  },
  {
    id: 7,
    title: 'स्तर 7: सीढ़ीदार रास्ता',
    concept: 'लूप के अंदर क्रम (Nested Patterns)',
    instruction: 'सीढ़ी जैसे पैटर्न को लूप का उपयोग करके पार करें।',
    hint: '3 बार दोहराएं: (आगे बढ़ो -> दाएँ मुड़ो -> आगे बढ़ो -> बाएँ मुड़ो)।',
    voiceText: 'स्तर सात! सीढ़ीदार रास्ते के पैटर्न को पहचानें।',
    gridSize: 8,
    startPos: { x: 1, y: 1 },
    startDir: 'EAST',
    targets: [{ x: 4, y: 4 }],
    obstacles: [{ x: 1, y: 2 }, { x: 2, y: 3 }],
    hasRepeatBlock: true,
  },
  {
    id: 8,
    title: 'स्तर 8: भूलभुलैया (Mini Maze)',
    concept: 'भूलभुलैया समाधान (Pathfinding)',
    instruction: 'दीवारों से बचते हुए सुरक्षित रास्ता खोजें।',
    hint: 'खुली गलियों पर नज़र रखें और सही समय पर मुड़ें।',
    voiceText: 'स्तर आठ! भूलभुलैया में रास्ता खोजें।',
    gridSize: 8,
    startPos: { x: 1, y: 1 },
    startDir: 'EAST',
    targets: [{ x: 6, y: 6 }],
    obstacles: [
      { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 4, y: 3 },
      { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 3, y: 6 }
    ],
    hasRepeatBlock: true,
  },
  {
    id: 9,
    title: 'स्तर 9: लंबा सफर',
    concept: 'लूप दक्षता (Loop Efficiency)',
    instruction: 'पूरे बोर्ड के किनारे-किनारे घूमकर फल प्राप्त करें।',
    hint: 'लंबे रास्तों के लिए दोहराव (Repeat) ब्लॉक का पूरा फायदा उठाएं।',
    voiceText: 'स्तर नौ! कम से कम ब्लॉक में लंबा सफर तय करें।',
    gridSize: 8,
    startPos: { x: 0, y: 0 },
    startDir: 'EAST',
    targets: [{ x: 6, y: 6 }],
    obstacles: [
      { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 },
      { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }
    ],
    hasRepeatBlock: true,
  },
  {
    id: 10,
    title: 'स्तर 10: मास्टर रिसर्चर 🎓',
    concept: 'महा-चुनौती (Master Challenge)',
    instruction: 'सभी 3 फल इकट्ठा करें और रुकावटों को चकमा दें!',
    hint: 'पूरा रास्ता पहले मन में सोचें, फिर लूप और मोड़ों का संयोजन करें।',
    voiceText: 'बधाई हो, आप अंतिम स्तर पर हैं! अपनी पूरी कोडिंग क्षमता दिखाएं।',
    gridSize: 8,
    startPos: { x: 0, y: 0 },
    startDir: 'EAST',
    targets: [{ x: 0, y: 6 }, { x: 6, y: 0 }, { x: 6, y: 6 }],
    obstacles: [
      { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 5 }, { x: 3, y: 6 },
      { x: 1, y: 3 }, { x: 5, y: 3 }
    ],
    hasRepeatBlock: true,
  }
];
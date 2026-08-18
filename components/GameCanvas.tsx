'use client';

import React from 'react';
import { Level } from '../lib/levels';

interface GameCanvasProps {
  level: Level;
  playerPos: { x: number; y: number; dir: 'NORTH' | 'EAST' | 'SOUTH' | 'WEST' };
  collectedTargets: { x: number; y: number }[];
}

export default function GameCanvas({ level, playerPos, collectedTargets }: GameCanvasProps) {
  const { gridSize, obstacles, targets } = level;

  // Clear directional rotation: UP (0°), RIGHT (90°), DOWN (180°), LEFT (270°)
  const getRotationDegrees = (dir: 'NORTH' | 'EAST' | 'SOUTH' | 'WEST') => {
    switch (dir) {
      case 'NORTH': return 'rotate-0';
      case 'EAST':  return 'rotate-90';
      case 'SOUTH': return 'rotate-180';
      case 'WEST':  return '-rotate-90';
      default:      return 'rotate-90';
    }
  };

  const cells = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const isPlayer = playerPos.x === c && playerPos.y === r;
      const isObstacle = obstacles.some((o) => o.x === c && o.y === r);
      const isTarget = targets.some((t) => t.x === c && t.y === r);
      const isCollected = collectedTargets.some((ct) => ct.x === c && ct.y === r);

      const isEven = (r + c) % 2 === 0;
      const bgColour = isEven ? 'bg-emerald-100' : 'bg-emerald-200';

      cells.push(
        <div
          key={`${r}-${c}`}
          className={`aspect-square flex items-center justify-center relative select-none rounded-sm transition-colors duration-150 ${bgColour}`}
        >
          {isObstacle && <span className="text-2xl md:text-3xl">🪨</span>}
          {isTarget && !isCollected && !isPlayer && (
            <span className="text-2xl md:text-3xl animate-bounce">🍌</span>
          )}
          {isPlayer && (
            <div
              className={`relative flex items-center justify-center transition-transform duration-300 transform ${getRotationDegrees(
                playerPos.dir
              )}`}
            >
              {/* Direction pointer arrow */}
              <div className="absolute -top-3 text-red-600 text-xs font-black drop-shadow animate-pulse">
                ▲
              </div>
              <span className="text-2xl md:text-3xl">🐵</span>
            </div>
          )}
        </div>
      );
    }
  }

  return (
    <div className="w-full max-w-[420px] aspect-square p-2 bg-emerald-700 rounded-2xl shadow-lg flex items-center justify-center border-4 border-emerald-800">
      <div
        className="w-full h-full grid gap-1 bg-emerald-600 p-1 rounded-xl"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
        }}
      >
        {cells}
      </div>
    </div>
  );
}
"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const GRID_SIZE = 8;
const START_X = 1;
const START_Y = 1;
const TARGET_X = 4;
const TARGET_Y = 1;

export type Direction = 0 | 1 | 2 | 3; // East, South, West, North

export interface GameCanvasHandle {
  reset: () => void;
  moveForward: () => Promise<void>;
  turnLeft: () => Promise<void>;
  turnRight: () => Promise<void>;
  collect: () => Promise<boolean>;
}

interface GameState {
  x: number;
  y: number;
  direction: Direction;
  collected: boolean;
}

const DIRECTION_DELTAS: Record<Direction, { dx: number; dy: number }> = {
  0: { dx: 1, dy: 0 },
  1: { dx: 0, dy: 1 },
  2: { dx: -1, dy: 0 },
  3: { dx: 0, dy: -1 },
};

function initialState(): GameState {
  return { x: START_X, y: START_Y, direction: 0, collected: false };
}

function drawGrid(ctx: CanvasRenderingContext2D, size: number) {
  const tile = size / GRID_SIZE;

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const isLight = (row + col) % 2 === 0;
      ctx.fillStyle = isLight ? "#DCFCE7" : "#BBF7D0";
      ctx.fillRect(col * tile, row * tile, tile, tile);
    }
  }

  ctx.strokeStyle = "#86EFAC";
  ctx.lineWidth = 1;
  for (let i = 0; i <= GRID_SIZE; i++) {
    ctx.beginPath();
    ctx.moveTo(i * tile, 0);
    ctx.lineTo(i * tile, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * tile);
    ctx.lineTo(size, i * tile);
    ctx.stroke();
  }
}

function drawBanana(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  tile: number,
  collected: boolean,
) {
  if (collected) return;

  const cx = (x - 0.5) * tile;
  const cy = (y - 0.5) * tile;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.4);

  ctx.fillStyle = "#FDE047";
  ctx.beginPath();
  ctx.arc(0, 0, tile * 0.22, 0.3, Math.PI * 1.6);
  ctx.lineTo(-tile * 0.08, tile * 0.05);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#CA8A04";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-tile * 0.05, -tile * 0.18);
  ctx.lineTo(tile * 0.02, -tile * 0.28);
  ctx.stroke();

  ctx.restore();
}

function drawMonkey(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  direction: Direction,
  tile: number,
) {
  const cx = (x - 0.5) * tile;
  const cy = (y - 0.5) * tile;
  const r = tile * 0.28;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((direction * Math.PI) / 2);

  // Ears
  ctx.fillStyle = "#92400E";
  ctx.beginPath();
  ctx.arc(-r * 0.75, -r * 0.55, r * 0.35, 0, Math.PI * 2);
  ctx.arc(r * 0.75, -r * 0.55, r * 0.35, 0, Math.PI * 2);
  ctx.fill();

  // Face
  ctx.fillStyle = "#D97706";
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // Face highlight
  ctx.fillStyle = "#FBBF24";
  ctx.beginPath();
  ctx.arc(0, r * 0.1, r * 0.72, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = "#1F2937";
  ctx.beginPath();
  ctx.arc(-r * 0.32, -r * 0.12, r * 0.12, 0, Math.PI * 2);
  ctx.arc(r * 0.32, -r * 0.12, r * 0.12, 0, Math.PI * 2);
  ctx.fill();

  // Smile
  ctx.strokeStyle = "#78350F";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, r * 0.08, r * 0.35, 0.15, Math.PI - 0.15);
  ctx.stroke();

  // Direction arrow
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.moveTo(r * 1.05, 0);
  ctx.lineTo(r * 0.55, -r * 0.22);
  ctx.lineTo(r * 0.55, r * 0.22);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function renderScene(
  canvas: HTMLCanvasElement,
  displayX: number,
  displayY: number,
  direction: Direction,
  collected: boolean,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const size = canvas.width;
  const tile = size / GRID_SIZE;

  ctx.clearRect(0, 0, size, size);
  drawGrid(ctx, size);
  drawBanana(ctx, TARGET_X, TARGET_Y, tile, collected);
  drawMonkey(ctx, displayX, displayY, direction, tile);
}

function animateValue(
  from: number,
  to: number,
  duration: number,
  onFrame: (value: number) => void,
): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      onFrame(from + (to - from) * eased);
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    };
    requestAnimationFrame(step);
  });
}

const GameCanvas = forwardRef<GameCanvasHandle>(function GameCanvas(_, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>(initialState);
  const gameStateRef = useRef<GameState>(initialState());
  const displayRef = useRef({ x: START_X, y: START_Y, direction: 0 as Direction });
  const animatingRef = useRef(false);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { x, y, direction } = displayRef.current;
    renderScene(canvas, x, y, direction, gameState.collected);
  }, [gameState.collected]);

  useEffect(() => {
    paint();
  }, [paint, gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const size = Math.min(parent.clientWidth, parent.clientHeight, 520);
      canvas.width = size;
      canvas.height = size;
      paint();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas.parentElement ?? canvas);
    return () => observer.disconnect();
  }, [paint]);

  useImperativeHandle(ref, () => ({
    reset() {
      animatingRef.current = false;
      const state = initialState();
      gameStateRef.current = state;
      displayRef.current = {
        x: state.x,
        y: state.y,
        direction: state.direction,
      };
      setGameState(state);
    },

    async moveForward() {
      if (animatingRef.current) return;
      animatingRef.current = true;

      const current = gameStateRef.current;
      const delta = DIRECTION_DELTAS[current.direction];
      const nextX = Math.min(GRID_SIZE, Math.max(1, current.x + delta.dx));
      const nextY = Math.min(GRID_SIZE, Math.max(1, current.y + delta.dy));

      const fromX = displayRef.current.x;
      const fromY = displayRef.current.y;

      await animateValue(0, 1, 320, (t) => {
        displayRef.current.x = fromX + (nextX - fromX) * t;
        displayRef.current.y = fromY + (nextY - fromY) * t;
        paint();
      });

      displayRef.current.x = nextX;
      displayRef.current.y = nextY;
      const nextState = { ...gameStateRef.current, x: nextX, y: nextY };
      gameStateRef.current = nextState;
      setGameState(nextState);
      animatingRef.current = false;
    },

    async turnLeft() {
      if (animatingRef.current) return;
      animatingRef.current = true;

      const to = ((gameStateRef.current.direction + 3) % 4) as Direction;
      await animateValue(0, 1, 220, () => paint());

      displayRef.current.direction = to;
      const nextState = { ...gameStateRef.current, direction: to };
      gameStateRef.current = nextState;
      setGameState(nextState);
      animatingRef.current = false;
    },

    async turnRight() {
      if (animatingRef.current) return;
      animatingRef.current = true;

      const to = ((gameStateRef.current.direction + 1) % 4) as Direction;
      await animateValue(0, 1, 220, () => paint());

      displayRef.current.direction = to;
      const nextState = { ...gameStateRef.current, direction: to };
      gameStateRef.current = nextState;
      setGameState(nextState);
      animatingRef.current = false;
    },

    async collect() {
      if (animatingRef.current) return false;
      animatingRef.current = true;

      const current = gameStateRef.current;
      const success =
        current.x === TARGET_X &&
        current.y === TARGET_Y &&
        !current.collected;

      if (success) {
        await animateValue(0, 1, 400, (t) => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          const size = canvas.width;
          const tile = size / GRID_SIZE;
          const { x, y, direction } = displayRef.current;
          ctx.clearRect(0, 0, size, size);
          drawGrid(ctx, size);
          drawMonkey(ctx, x, y, direction, tile);
          ctx.save();
          ctx.globalAlpha = 1 - t;
          drawBanana(ctx, TARGET_X, TARGET_Y, tile, false);
          ctx.restore();
        });
        const nextState = { ...gameStateRef.current, collected: true };
        gameStateRef.current = nextState;
        setGameState(nextState);
      }

      animatingRef.current = false;
      return success;
    },
  }), [paint]);

  return (
    <div className="flex h-full w-full items-center justify-center bg-emerald-50/60 p-4">
      <canvas
        ref={canvasRef}
        className="max-h-full max-w-full rounded-2xl border-4 border-emerald-200 bg-white shadow-inner"
        aria-label="8x8 कोडिंग ग्रिड — बंदर (1,1) पर, केला (4,1) पर"
      />
    </div>
  );
});

export default GameCanvas;

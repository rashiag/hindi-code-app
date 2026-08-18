"use client";

import { useCallback, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { Play } from "lucide-react";
import GameCanvas, { type GameCanvasHandle } from "@/components/GameCanvas";
import BlocklyWorkspace, {
  type BlocklyWorkspaceHandle,
} from "@/components/BlocklyWorkspace";
import type { GameCommand } from "@/lib/blockly-config";

const STEP_DELAY_MS = 120;

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function fireVictoryConfetti() {
  const duration = 2200;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: ["#22C55E", "#FACC15", "#F97316", "#3B82F6"],
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: ["#22C55E", "#FACC15", "#F97316", "#3B82F6"],
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  confetti({
    particleCount: 120,
    spread: 90,
    origin: { y: 0.55 },
  });
  frame();
}

async function runCommand(
  canvas: GameCanvasHandle,
  command: GameCommand,
): Promise<boolean> {
  switch (command) {
    case "moveForward":
      await canvas.moveForward();
      return false;
    case "turnLeft":
      await canvas.turnLeft();
      return false;
    case "turnRight":
      await canvas.turnRight();
      return false;
    case "collect":
      return canvas.collect();
  }
}

export default function Home() {
  const canvasRef = useRef<GameCanvasHandle>(null);
  const blocklyRef = useRef<BlocklyWorkspaceHandle>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showVictory, setShowVictory] = useState(false);

  const handleRunCode = useCallback(async () => {
    if (isRunning || !canvasRef.current || !blocklyRef.current) return;

    setIsRunning(true);
    setShowVictory(false);
    canvasRef.current.reset();

    const commands = blocklyRef.current.getCommands();
    let won = false;

    for (const command of commands) {
      const collected = await runCommand(canvasRef.current, command);
      if (collected) {
        won = true;
        break;
      }
      await delay(STEP_DELAY_MS);
    }

    if (won) {
      fireVictoryConfetti();
      setShowVictory(true);
    }

    setIsRunning(false);
  }, [isRunning]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/40 to-sky-50">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-emerald-100 bg-white/90 px-4 py-3 shadow-sm backdrop-blur sm:px-6">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold text-emerald-900 sm:text-xl">
            Young Researcher - कोडिंग सीखें
          </h1>
          <p className="text-sm font-medium text-emerald-700/80">
            स्तर 1: पहला कदम
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunCode}
          disabled={isRunning}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 sm:text-base"
        >
          <Play className="h-4 w-4 fill-current" aria-hidden />
          ▶ कोड चलाएं (Run Code)
        </button>
      </header>

      <main className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <section className="flex h-[45vh] min-h-[280px] w-full flex-col border-b border-emerald-100 lg:h-auto lg:w-[40%] lg:border-b-0 lg:border-r">
          <div className="border-b border-emerald-100 bg-white/70 px-4 py-2 text-sm font-medium text-emerald-800">
            गेम ग्रिड — बंदर को केले तक पहुँचाएँ
          </div>
          <div className="min-h-0 flex-1">
            <GameCanvas ref={canvasRef} />
          </div>
        </section>

        <section className="flex min-h-0 flex-1 flex-col lg:w-[60%]">
          <div className="border-b border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700">
            ब्लॉक्स खींचें और जोड़ें — फिर कोड चलाएं
          </div>
          <div className="min-h-0 flex-1">
            <BlocklyWorkspace ref={blocklyRef} />
          </div>
        </section>
      </main>

      {showVictory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="victory-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
            <div className="mb-4 text-5xl" aria-hidden>
              🎉
            </div>
            <h2
              id="victory-title"
              className="mb-2 text-2xl font-bold text-emerald-800"
            >
              शाबाश!
            </h2>
            <p className="mb-6 text-lg text-emerald-700">
              आपने स्तर 1 पूरा कर लिया!
            </p>
            <button
              type="button"
              onClick={() => setShowVictory(false)}
              className="rounded-xl bg-emerald-500 px-6 py-2.5 font-semibold text-white transition hover:bg-emerald-600"
            >
              बंद करें
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

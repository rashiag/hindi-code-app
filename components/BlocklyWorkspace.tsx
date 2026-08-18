"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import * as Blockly from "blockly";
import {
  extractCommands,
  registerHindiBlocks,
  toolboxConfig,
  type GameCommand,
} from "@/lib/blockly-config";

export interface BlocklyWorkspaceHandle {
  getCommands: () => GameCommand[];
}

const BlocklyWorkspace = forwardRef<BlocklyWorkspaceHandle>(
  function BlocklyWorkspace(_, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

    useImperativeHandle(ref, () => ({
      getCommands() {
        if (!workspaceRef.current) return [];
        return extractCommands(workspaceRef.current);
      },
    }));

    useEffect(() => {
      if (!containerRef.current) return;

      registerHindiBlocks();

      const workspace = Blockly.inject(containerRef.current, {
        toolbox: toolboxConfig,
        scrollbars: true,
        trashcan: true,
        renderer: "zelos",
        theme: Blockly.Theme.defineTheme("hindiKids", {
          base: Blockly.Themes.Zelos,
          fontStyle: {
            family: "'Noto Sans Devanagari', 'Segoe UI', sans-serif",
            weight: "500",
            size: 13,
          },
        }),
      });

      workspaceRef.current = workspace;

      const startBlock = workspace.newBlock("program_start");
      startBlock.initSvg();
      startBlock.render();
      startBlock.moveBy(40, 40);

      const handleResize = () => {
        Blockly.svgResize(workspace);
      };

      handleResize();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        workspace.dispose();
        workspaceRef.current = null;
      };
    }, []);

    return (
      <div className="relative h-full w-full overflow-hidden bg-slate-50">
        <div ref={containerRef} className="absolute inset-0" />
      </div>
    );
  },
);

export default BlocklyWorkspace;

'use client';

import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly';

function initCustomBlocks() {
  if (!Blockly.Blocks['when_run']) {
    Blockly.Blocks['when_run'] = {
      init: function () {
        this.appendDummyInput().appendField('🚀 जब कोड चलाएं');
        this.setNextStatement(true, null);
        this.setColour('#4A90E2');
      },
    };
  }

  if (!Blockly.Blocks['move_forward']) {
    Blockly.Blocks['move_forward'] = {
      init: function () {
        this.appendDummyInput().appendField('आगे बढ़ो (1)');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#43A047');
      },
    };
  }

  if (!Blockly.Blocks['turn_left']) {
    Blockly.Blocks['turn_left'] = {
      init: function () {
        this.appendDummyInput().appendField('↶ बाएँ मुड़ो');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#1E88E5');
      },
    };
  }

  if (!Blockly.Blocks['turn_right']) {
    Blockly.Blocks['turn_right'] = {
      init: function () {
        this.appendDummyInput().appendField('↷ दाएँ मुड़ो');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#1E88E5');
      },
    };
  }

  if (!Blockly.Blocks['collect_item']) {
    Blockly.Blocks['collect_item'] = {
      init: function () {
        this.appendDummyInput().appendField('🍌 केला उठाओ');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#8E24AA');
      },
    };
  }

  if (!Blockly.Blocks['repeat_times']) {
    Blockly.Blocks['repeat_times'] = {
      init: function () {
        this.appendDummyInput()
          .appendField('🔁')
          .appendField(new Blockly.FieldNumber(2, 1, 10), 'TIMES')
          .appendField('बार दोहराओ');
        this.appendStatementInput('DO').appendField('करें');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#FB8C00');
      },
    };
  }
}

function parseBlocks(block: Blockly.Block | null): string[] {
  const list: string[] = [];
  let curr = block;
  while (curr) {
    if (curr.type === 'move_forward') list.push('MOVE_FORWARD');
    if (curr.type === 'turn_left') list.push('TURN_LEFT');
    if (curr.type === 'turn_right') list.push('TURN_RIGHT');
    if (curr.type === 'collect_item') list.push('COLLECT_ITEM');
    if (curr.type === 'repeat_times') {
      const times = parseInt(curr.getFieldValue('TIMES') || '1', 10);
      const inner = curr.getInputTargetBlock('DO');
      const innerList = parseBlocks(inner);
      for (let i = 0; i < times; i++) {
        list.push(...innerList);
      }
    }
    curr = curr.getNextBlock();
  }
  return list;
}

interface BlocklyWorkspaceProps {
  onRunCode: (actions: string[]) => void;
  onReset: () => void;
  isRunning: boolean;
  hasRepeat?: boolean;
}

export default function BlocklyWorkspace({
  onRunCode,
  onReset,
  isRunning,
  hasRepeat = false,
}: BlocklyWorkspaceProps) {
  const blocklyDivRef = useRef<HTMLDivElement | null>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  useEffect(() => {
    initCustomBlocks();
    if (!blocklyDivRef.current) return;

    const toolboxXml = `
      <xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
        <block type="move_forward"></block>
        <block type="turn_left"></block>
        <block type="turn_right"></block>
        <block type="collect_item"></block>
        ${hasRepeat ? '<block type="repeat_times"></block>' : ''}
      </xml>
    `;

    if (!workspaceRef.current) {
      workspaceRef.current = Blockly.inject(blocklyDivRef.current, {
        toolbox: toolboxXml,
        scrollbars: true,
        trashcan: true,
        sounds: false,
        grid: { spacing: 20, length: 3, colour: '#e2e8f0', snap: true },
        zoom: { controls: true, wheel: true, startScale: 0.9, maxScale: 1.5, minScale: 0.6 },
      });

      const startBlock = workspaceRef.current.newBlock('when_run');
      startBlock.initSvg();
      startBlock.render();
      startBlock.setMovable(false);
      startBlock.setDeletable(false);
      startBlock.moveBy(20, 20);
    } else {
      workspaceRef.current.updateToolbox(toolboxXml);
    }

    return () => {
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
  }, [hasRepeat]);

  const handleExecute = () => {
    if (!workspaceRef.current || isRunning) return;
    const all = workspaceRef.current.getAllBlocks(false);
    const start = all.find((b) => b.type === 'when_run');
    if (!start) return;

    const first = start.getNextBlock();
    if (!first) {
      alert('कृपया "जब कोड चलाएं" के नीचे ब्लॉक जोड़ें!');
      return;
    }

    const actions = parseBlocks(first);
    onRunCode(actions);
  };

  const handleReset = () => {
    if (!workspaceRef.current || isRunning) return;
    workspaceRef.current.clear();
    const startBlock = workspaceRef.current.newBlock('when_run');
    startBlock.initSvg();
    startBlock.render();
    startBlock.setMovable(false);
    startBlock.setDeletable(false);
    startBlock.moveBy(20, 20);
    onReset();
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200">
        <h2 className="font-bold text-slate-800 text-sm md:text-base">💻 ब्लॉक कोडिंग क्षेत्र</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            disabled={isRunning}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition active:scale-95"
          >
            साफ़ करें (Reset)
          </button>
          <button
            onClick={handleExecute}
            disabled={isRunning}
            className={`px-5 py-2 rounded-xl font-bold text-white shadow-md transition flex items-center gap-2 ${
              isRunning ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:scale-95 text-sm'
            }`}
          >
            {isRunning ? 'चल रहा है...' : 'कोड चलाएं ▶'}
          </button>
        </div>
      </div>
      <div
        ref={blocklyDivRef}
        className="w-full rounded-xl overflow-hidden border border-slate-200"
        style={{ height: '440px', minHeight: '440px' }}
      />
    </div>
  );
}
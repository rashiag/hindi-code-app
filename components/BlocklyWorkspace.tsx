'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly';
import { Level } from '../lib/levels';

function initCustomBlocks(lang: 'hi' | 'en') {
  // 1. When Run Block
  Blockly.Blocks['when_run'] = {
    init: function () {
      this.appendDummyInput().appendField(
        lang === 'hi' ? '🚀 जब कोड चलाएं' : '🚀 When Code Runs'
      );
      this.setNextStatement(true, null);
      this.setColour('#4A90E2');
    },
  };

  // 2. Move Forward Block
  Blockly.Blocks['move_forward'] = {
    init: function () {
      this.appendDummyInput().appendField(
        lang === 'hi' ? 'आगे बढ़ो (1)' : 'Move Forward (1)'
      );
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#43A047');
    },
  };

  // 3. Turn Left Block
  Blockly.Blocks['turn_left'] = {
    init: function () {
      this.appendDummyInput().appendField(
        lang === 'hi' ? '↶ बाएँ मुड़ो' : '↶ Turn Left'
      );
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#1E88E5');
    },
  };

  // 4. Turn Right Block
  Blockly.Blocks['turn_right'] = {
    init: function () {
      this.appendDummyInput().appendField(
        lang === 'hi' ? '↷ दाएँ मुड़ो' : '↷ Turn Right'
      );
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#1E88E5');
    },
  };

  // 5. Collect Item Block
  Blockly.Blocks['collect_item'] = {
    init: function () {
      this.appendDummyInput().appendField(
        lang === 'hi' ? '🍌 केला उठाओ' : '🍌 Collect Banana'
      );
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#8E24AA');
    },
  };

  // 6. Repeat Block
  Blockly.Blocks['repeat_times'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('🔁')
        .appendField(new Blockly.FieldNumber(2, 1, 10), 'TIMES')
        .appendField(lang === 'hi' ? 'बार दोहराओ' : 'Times Repeat');
      this.appendStatementInput('DO').appendField(
        lang === 'hi' ? 'करें' : 'Do'
      );
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#FB8C00');
    },
  };

  // 7. Conditional Block
  Blockly.Blocks['if_obstacle_ahead'] = {
    init: function () {
      this.appendDummyInput().appendField(
        lang === 'hi' ? '❓ अगर आगे पत्थर हो' : '❓ If Rock Ahead'
      );
      this.appendStatementInput('DO').appendField(
        lang === 'hi' ? 'तो करें' : 'Then Do'
      );
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#E53935');
    },
  };
}

export type ActionItem =
  | { type: 'MOVE_FORWARD' }
  | { type: 'TURN_LEFT' }
  | { type: 'TURN_RIGHT' }
  | { type: 'COLLECT_ITEM' }
  | { type: 'IF_OBSTACLE'; branch: ActionItem[] };

function parseBlockHierarchy(block: Blockly.Block | null): ActionItem[] {
  const list: ActionItem[] = [];
  let curr = block;
  while (curr) {
    if (curr.type === 'move_forward') list.push({ type: 'MOVE_FORWARD' });
    if (curr.type === 'turn_left') list.push({ type: 'TURN_LEFT' });
    if (curr.type === 'turn_right') list.push({ type: 'TURN_RIGHT' });
    if (curr.type === 'collect_item') list.push({ type: 'COLLECT_ITEM' });
    if (curr.type === 'if_obstacle_ahead') {
      const branchBlock = curr.getInputTargetBlock('DO');
      list.push({ type: 'IF_OBSTACLE', branch: parseBlockHierarchy(branchBlock) });
    }
    if (curr.type === 'repeat_times') {
      const times = parseInt(curr.getFieldValue('TIMES') || '1', 10);
      const inner = curr.getInputTargetBlock('DO');
      const innerActions = parseBlockHierarchy(inner);
      for (let i = 0; i < times; i++) {
        list.push(...innerActions);
      }
    }
    curr = curr.getNextBlock();
  }
  return list;
}

interface BlocklyWorkspaceProps {
  onRunCode: (actions: ActionItem[], blockCount: number) => void;
  onReset: () => void;
  isRunning: boolean;
  allowedBlocks: Level['allowedBlocks'];
}

export default function BlocklyWorkspace({
  onRunCode,
  onReset,
  isRunning,
  allowedBlocks,
}: BlocklyWorkspaceProps) {
  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  const blocklyDivRef = useRef<HTMLDivElement | null>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  const buildToolboxXml = () => {
    let blocksXml = '';
    if (allowedBlocks?.moveForward) blocksXml += '<block type="move_forward"></block>';
    if (allowedBlocks?.turnLeft) blocksXml += '<block type="turn_left"></block>';
    if (allowedBlocks?.turnRight) blocksXml += '<block type="turn_right"></block>';
    if (allowedBlocks?.collectItem) blocksXml += '<block type="collect_item"></block>';
    if (allowedBlocks?.repeat) blocksXml += '<block type="repeat_times"></block>';
    if (allowedBlocks?.condition) blocksXml += '<block type="if_obstacle_ahead"></block>';

    return `<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">${blocksXml}</xml>`;
  };

  useEffect(() => {
    initCustomBlocks(lang);
    if (!blocklyDivRef.current) return;

    const toolboxXml = buildToolboxXml();

    if (!workspaceRef.current) {
      workspaceRef.current = Blockly.inject(blocklyDivRef.current, {
        toolbox: toolboxXml,
        scrollbars: true,
        trashcan: true,
        sounds: false,
        grid: { spacing: 20, length: 3, colour: '#e2e8f0', snap: true },
        zoom: { controls: true, wheel: true, startScale: 0.85, maxScale: 1.4, minScale: 0.6 },
      });

      const startBlock = workspaceRef.current.newBlock('when_run');
      startBlock.initSvg();
      startBlock.render();
      startBlock.setMovable(false);
      startBlock.setDeletable(false);
      startBlock.moveBy(20, 20);
    } else {
      // Re-initialize blocks with new language labels and refresh toolbox
      workspaceRef.current.updateToolbox(toolboxXml);
    }
  }, [allowedBlocks, lang]);

  const handleExecute = () => {
    if (!workspaceRef.current || isRunning) return;
    const all = workspaceRef.current.getAllBlocks(false);
    const start = all.find((b) => b.type === 'when_run');
    if (!start) return;

    const first = start.getNextBlock();
    if (!first) {
      alert(lang === 'hi' ? 'कृपया "जब कोड चलाएं" के नीचे ब्लॉक जोड़ें!' : 'Please attach code blocks below "When Code Runs"!');
      return;
    }

    const totalBlocksUsed = all.length - 1;
    const actionPlan = parseBlockHierarchy(first);
    onRunCode(actionPlan, totalBlocksUsed);
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
    <div className="flex flex-col h-full w-full select-none font-sans">
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-black text-slate-800 text-sm md:text-base">
            {lang === 'hi' ? '💻 ब्लॉक कोडिंग क्षेत्र' : '💻 Visual Block Coding'}
          </h2>

          {/* BILINGUAL LANGUAGE SWITCHER */}
          <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setLang('hi')}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                lang === 'hi' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                lang === 'en' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              English
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            disabled={isRunning}
            className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {lang === 'hi' ? 'साफ़ करें (Reset)' : 'Reset'}
          </button>
          <button
            onClick={handleExecute}
            disabled={isRunning}
            className={`px-5 py-2 rounded-xl font-black text-white shadow-md transition flex items-center gap-2 cursor-pointer ${
              isRunning ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:scale-95 text-xs md:text-sm'
            }`}
          >
            {isRunning 
              ? (lang === 'hi' ? 'चल रहा है...' : 'Running...') 
              : (lang === 'hi' ? 'कोड चलाएं ▶' : 'Run Code ▶')}
          </button>
        </div>
      </div>
      <div
        ref={blocklyDivRef}
        className="w-full rounded-2xl overflow-hidden border-2 border-slate-200 shadow-inner"
        style={{ height: '440px', minHeight: '440px' }}
      />
    </div>
  );
}
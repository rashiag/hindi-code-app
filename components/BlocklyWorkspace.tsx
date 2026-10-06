'use client';

import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly';
import { Level } from '../lib/levels';

function initCustomBlocks(lang: 'hi' | 'en') {
  Blockly.Blocks['when_run'] = {
    init: function () {
      this.appendDummyInput().appendField(
        lang === 'hi' ? '🚀 जब कोड चलाएं' : '🚀 When Code Runs'
      );
      this.setNextStatement(true, null);
      this.setColour('#4A90E2');
    },
  };

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
  lang: 'hi' | 'en';
  onToggleLang?: (newLang: 'hi' | 'en') => void;
}

export default function BlocklyWorkspace({
  onRunCode,
  onReset,
  isRunning,
  allowedBlocks,
  lang,
  onToggleLang,
}: BlocklyWorkspaceProps) {
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

  // Re-label every block already placed on the grid whenever language changes
  const updateExistingBlocksOnGrid = (ws: Blockly.WorkspaceSvg, currentLang: 'hi' | 'en') => {
    const all = ws.getAllBlocks(false);
    all.forEach((b) => {
      try {
        if (b.type === 'when_run') {
          const field = b.inputList[0]?.fieldRow[0];
          if (field) field.setValue(currentLang === 'hi' ? '🚀 जब कोड चलाएं' : '🚀 When Code Runs');
        } else if (b.type === 'move_forward') {
          const field = b.inputList[0]?.fieldRow[0];
          if (field) field.setValue(currentLang === 'hi' ? 'आगे बढ़ो (1)' : 'Move Forward (1)');
        } else if (b.type === 'turn_left') {
          const field = b.inputList[0]?.fieldRow[0];
          if (field) field.setValue(currentLang === 'hi' ? '↶ बाएँ मुड़ो' : '↶ Turn Left');
        } else if (b.type === 'turn_right') {
          const field = b.inputList[0]?.fieldRow[0];
          if (field) field.setValue(currentLang === 'hi' ? '↷ दाएँ मुड़ो' : '↷ Turn Right');
        } else if (b.type === 'collect_item') {
          const field = b.inputList[0]?.fieldRow[0];
          if (field) field.setValue(currentLang === 'hi' ? '🍌 केला उठाओ' : '🍌 Collect Banana');
        } else if (b.type === 'repeat_times') {
          if (b.inputList[0]?.fieldRow[2]) {
            b.inputList[0].fieldRow[2].setValue(currentLang === 'hi' ? 'बार दोहराओ' : 'Times Repeat');
          }
          if (b.inputList[1]?.fieldRow[0]) {
            b.inputList[1].fieldRow[0].setValue(currentLang === 'hi' ? 'करें' : 'Do');
          }
        } else if (b.type === 'if_obstacle_ahead') {
          if (b.inputList[0]?.fieldRow[0]) {
            b.inputList[0].fieldRow[0].setValue(currentLang === 'hi' ? '❓ अगर आगे पत्थर हो' : '❓ If Rock Ahead');
          }
          if (b.inputList[1]?.fieldRow[0]) {
            b.inputList[1].fieldRow[0].setValue(currentLang === 'hi' ? 'तो करें' : 'Then Do');
          }
        }
      } catch (e) {}
    });
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
      workspaceRef.current.updateToolbox(toolboxXml);
      updateExistingBlocksOnGrid(workspaceRef.current, lang);
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
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200 flex-wrap gap-2 px-3 pt-2">
        <div className="flex items-center gap-2">
          <h2 className="font-black text-slate-800 text-sm md:text-base">
            {lang === 'hi' ? '💻 ब्लॉक कोडिंग क्षेत्र' : '💻 Visual Block Coding'}
          </h2>

          {/* BILINGUAL LANGUAGE SWITCHER */}
          <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => onToggleLang && onToggleLang('hi')}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                lang === 'hi' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => onToggleLang && onToggleLang('en')}
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
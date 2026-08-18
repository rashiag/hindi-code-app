import * as Blockly from "blockly";

let blocksRegistered = false;

export type GameCommand =
  | "moveForward"
  | "turnLeft"
  | "turnRight"
  | "collect";

export function registerHindiBlocks() {
  if (blocksRegistered) return;
  blocksRegistered = true;

  Blockly.common.defineBlocks({
    program_start: {
      init: function (this: Blockly.Block) {
        this.appendDummyInput().appendField("जब कोड चलाएं");
        this.appendStatementInput("STACK");
        this.setColour("#5C81A6");
        this.setDeletable(false);
        this.setMovable(false);
      },
    },
    move_forward: {
      init: function (this: Blockly.Block) {
        this.appendDummyInput().appendField("आगे बढ़ो (1)");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#5BA58C");
      },
    },
    turn_right: {
      init: function (this: Blockly.Block) {
        this.appendDummyInput().appendField("दाएँ मुड़ो");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#5BA58C");
      },
    },
    turn_left: {
      init: function (this: Blockly.Block) {
        this.appendDummyInput().appendField("बाएँ मुड़ो");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#5BA58C");
      },
    },
    collect: {
      init: function (this: Blockly.Block) {
        this.appendDummyInput().appendField("केला उठाओ");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#A65C81");
      },
    },
    hindi_repeat: {
      init: function (this: Blockly.Block) {
        this.appendValueInput("TIMES").setCheck("Number");
        this.appendDummyInput().appendField("बार दोहराओ");
        this.appendStatementInput("DO");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#5CA65C");
      },
    },
    hindi_number: {
      init: function (this: Blockly.Block) {
        this.appendDummyInput().appendField(
          new Blockly.FieldNumber(3, 1, 10),
          "NUM",
        );
        this.setOutput(true, "Number");
        this.setColour("#5C68A6");
      },
    },
  });
}

function getRepeatCount(block: Blockly.Block): number {
  const timesBlock = block.getInputTargetBlock("TIMES");
  if (
    timesBlock?.type === "hindi_number" ||
    timesBlock?.type === "math_number"
  ) {
    return Math.max(
      0,
      Math.floor(Number(timesBlock.getFieldValue("NUM")) || 0),
    );
  }
  return Math.max(0, Math.floor(Number(block.getFieldValue("TIMES")) || 0));
}

function parseBlock(block: Blockly.Block): GameCommand[] {
  switch (block.type) {
    case "move_forward":
      return ["moveForward"];
    case "turn_right":
      return ["turnRight"];
    case "turn_left":
      return ["turnLeft"];
    case "collect":
      return ["collect"];
    case "hindi_repeat": {
      const times = getRepeatCount(block);
      const doBlock = block.getInputTargetBlock("DO");
      const inner = parseBlockChain(doBlock);
      const repeated: GameCommand[] = [];
      for (let i = 0; i < times; i++) {
        repeated.push(...inner);
      }
      return repeated;
    }
    default:
      return [];
  }
}

function parseBlockChain(block: Blockly.Block | null): GameCommand[] {
  const commands: GameCommand[] = [];
  let current = block;
  while (current) {
    commands.push(...parseBlock(current));
    current = current.getNextBlock();
  }
  return commands;
}

export function extractCommands(workspace: Blockly.Workspace): GameCommand[] {
  const startBlocks = workspace.getBlocksByType("program_start", false);
  const startBlock = startBlocks[0];
  if (!startBlock) return [];
  const stackBlock = startBlock.getInputTargetBlock("STACK");
  return parseBlockChain(stackBlock);
}

export const toolboxConfig: Blockly.utils.toolbox.ToolboxDefinition = {
  kind: "flyoutToolbox",
  contents: [
    { kind: "block", type: "move_forward" },
    { kind: "block", type: "turn_left" },
    { kind: "block", type: "turn_right" },
    { kind: "block", type: "collect" },
    {
      kind: "block",
      type: "hindi_repeat",
      inputs: {
        TIMES: {
          shadow: {
            type: "hindi_number",
            fields: { NUM: 3 },
          },
        },
      },
    },
    {
      kind: "block",
      type: "hindi_number",
      fields: { NUM: 1 },
    },
  ],
};

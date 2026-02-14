import type { Component } from "@mariozechner/pi-tui";
import { visibleWidth } from "@mariozechner/pi-tui";

// ═══════════════════════════════════════════════════════════════════════════
// ANSI Color Utilities
// ═══════════════════════════════════════════════════════════════════════════

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";

const GRADIENT_COLORS = [
  "\x1b[38;5;199m", // Pink
  "\x1b[38;5;171m", // Light pink
  "\x1b[38;5;135m", // Purple
  "\x1b[38;5;99m", // Blue-purple
  "\x1b[38;5;75m", // Blue
  "\x1b[38;5;51m", // Cyan
];

const ACCENT = "\x1b[38;5;135m"; // Purple

function bold(text: string): string {
  return `${BOLD}${text}\x1b[22m`;
}

function dim(text: string): string {
  return `${DIM}${text}${RESET}`;
}

function colored(color: string, text: string): string {
  return `${color}${text}${RESET}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// Rendering Utilities
// ═══════════════════════════════════════════════════════════════════════════

const PI_LOGO = [
  "▀████████████▀",
  "  ███    ███  ",
  "  ███    ███  ",
  "  ███    ███  ",
  " ▄███▄  ▄███▄ ",
];

const TAGLINES = [
  "Ready to move the needle.",
  "Coffee is for closers.",
  "Always be shipping.",
  "There is no try. Only deploy.",
  "Be excellent to each other.",
  "The code is strong with this one.",
  "I know Kung Fu. Show me.",
  "Follow the white rabbit.",
  "Free your mind.",
  "Stop trying to hit it. Hit it.",
  "What is real? Show me the logs.",
  "You take the red pill—you stay in Wonderland.",
  "The Matrix has you. But you have Pi.",
  "Do not try and bend the spoon.",
  "I can only show you the door.",
  "Make the sale. Ship the feature.",
  "Put that coffee down. Code's for closers.",
  "A-B-C. Always Be Coding.",
  "You call that a commit message?",
  "Brass balls. Ship it.",
  "Pick up the phone and make the call.",
  "The leads are weak? You're weak.",
  "First prize is a Cadillac Eldorado.",
  "Second prize is a set of steak knives.",
  "Third prize means we need to talk.",
  "We're adding a little something to this.",
  "I'm gonna get medieval on this codebase.",
  "Say 'git stash' again. I dare you.",
  "The path of the righteous coder.",
  "Let it rip!",
  "Does it look like a bug?",
  "Blessed is he who shepherds production.",
  "And you will know my name is the Lord.",
  "Royale with Cheese. Deploy with confidence.",
  "That's a tasty burger. That's tasty code.",
  "Let's get into character.",
  "Zed's dead, baby. Bugs are dead.",
  "The night of the fight, you came.",
  "I'm pretty fuckin' far from OK.",
  "We happy? Yeah, we happy.",
  "It's the one that says 'Bad Developer'.",
  "English, do you speak it?",
  "What does Technical Debt look like?",
  "You're in the chair. Make it happen.",
  "Ken Thompson doesn't give speeches.",
  "Today we are canceling the bugs.",
  "This is not the end. Not even close.",
  "Show me what you're made of.",
  "The time is always right to do right.",
  "Fortune favors the bold. And the tested.",
  "Make it so. Make it ship.",
];

function getRandomTagline(): string {
  return TAGLINES[Math.floor(Math.random() * TAGLINES.length)];
}

function gradientLine(line: string): string {
  let result = "";
  let colorIdx = 0;
  const step = Math.max(1, Math.floor(line.length / GRADIENT_COLORS.length));

  for (let i = 0; i < line.length; i++) {
    if (i > 0 && i % step === 0 && colorIdx < GRADIENT_COLORS.length - 1) {
      colorIdx++;
    }
    const char = line[i];
    if (char !== " ") {
      result += GRADIENT_COLORS[colorIdx] + char + RESET;
    } else {
      result += char;
    }
  }
  return result;
}

function centerText(text: string, width: number): string {
  const visLen = visibleWidth(text);
  if (visLen >= width) return text;

  const leftPad = Math.floor((width - visLen) / 2);
  const rightPad = width - visLen - leftPad;
  return " ".repeat(leftPad) + text + " ".repeat(rightPad);
}

function padToWidth(str: string, width: number): string {
  const visLen = visibleWidth(str);
  if (visLen >= width) return str;
  return str + " ".repeat(width - visLen);
}

// ═══════════════════════════════════════════════════════════════════════════
// Box Rendering
// ═══════════════════════════════════════════════════════════════════════════

function buildLeftColumn(colWidth: number, tagline: string): string[] {
  const logoColored = PI_LOGO.map((line) => gradientLine(line));

  return [
    "",
    centerText(bold("Welcome to Pi!"), colWidth),
    "",
    ...logoColored.map((l) => centerText(l, colWidth)),
    "",
    centerText(dim(tagline), colWidth),
  ];
}

function buildRightColumn(colWidth: number): string[] {
  const hChar = "─";
  const separator = ` ${dim(hChar.repeat(colWidth - 2))}`;

  return [
    ` ${bold(colored(ACCENT, "Quick Tips"))}`,
    ` ${dim("/")} for commands`,
    ` ${dim("!")} to run bash`,
    ` ${dim("Esc")} cancel/abort`,
    ` ${dim("/quit")} quit pi`,
    separator,
    ` ${bold(colored(ACCENT, "Navigation"))}`,
    ` ${dim("Shift+Tab")} cycle thinking level`,
    ` ${dim("Ctrl+P")} cycle scoped model`,
    ` ${dim("Ctrl+O")} toggle tool output`,
    ` ${dim("Ctrl+T")} toggle thinking blocks`,
    ` ${dim("Esc Esc")} open /tree`,
  ];
}

function renderBox(termWidth: number, tagline: string): string[] {
  const minLayoutWidth = 80;
  if (termWidth < minLayoutWidth) return [];

  // Box is 80% of terminal width (min 80 cols)
  const boxWidth = Math.max(80, Math.floor(termWidth * 0.9));

  const leftCol = Math.max(48, Math.floor(boxWidth * 0.6));
  const rightCol = Math.max(1, boxWidth - leftCol - 3);

  const hChar = "─";
  const v = dim("│");
  const tl = dim("╭");
  const tr = dim("╮");
  const bl = dim("╰");
  const br = dim("╯");

  const leftLines = buildLeftColumn(leftCol, tagline);
  const rightLines = buildRightColumn(rightCol);

  const lines: string[] = [];

  // Top border with T-junction
  const topLeft = dim(hChar.repeat(leftCol));
  const topRight = dim(hChar.repeat(rightCol));
  lines.push(tl + topLeft + dim("┬") + topRight + tr);

  // Content rows
  const maxRows = Math.max(leftLines.length, rightLines.length);
  for (let i = 0; i < maxRows; i++) {
    const left = padToWidth(leftLines[i] ?? "", leftCol);
    const right = padToWidth(rightLines[i] ?? "", rightCol);
    lines.push(v + left + v + right + v);
  }

  // Bottom border with T-junction
  const bottomLeft = dim(hChar.repeat(leftCol));
  const bottomRight = dim(hChar.repeat(rightCol));
  lines.push(bl + bottomLeft + dim("┴") + bottomRight + br);

  return lines;
}

// ═══════════════════════════════════════════════════════════════════════════
// Components
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Splash header component
 */
export class SplashHeader implements Component {
  private tagline: string;

  constructor() {
    // Pick tagline once when component is created
    this.tagline = getRandomTagline();
  }

  invalidate(): void {}

  render(termWidth: number): string[] {
    const lines = renderBox(termWidth, this.tagline);

    if (lines.length > 0) {
      lines.push(""); // Add spacing
    }
    return lines;
  }
}

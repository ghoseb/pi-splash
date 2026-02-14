import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { SplashHeader } from "./splash.js";

/**
 * Pi Splash Screen Extension
 *
 * Displays a splash header on session start with:
 * - Gradient logo
 * - Random motivational tagline
 * - Quick tips and keyboard shortcuts
 *
 * Dismisses on first user message or agent activity.
 */
export default function piSplash(pi: ExtensionAPI) {
  let headerActive = false;

  pi.on("session_start", async (_event, ctx) => {
    if (!ctx.hasUI) return;

    const header = new SplashHeader();
    headerActive = true;

    ctx.ui.setHeader(() => ({
      render(width: number): string[] {
        return header.render(width);
      },
      invalidate() {
        header.invalidate();
      },
    }));
  });

  // Dismiss on first user message
  pi.on("user_message", async (_event, ctx) => {
    if (headerActive) {
      headerActive = false;
      ctx.ui.setHeader(undefined);
    }
  });

  // Also dismiss when agent starts
  pi.on("agent_start", async (_event, ctx) => {
    if (headerActive) {
      headerActive = false;
      ctx.ui.setHeader(undefined);
    }
  });
}

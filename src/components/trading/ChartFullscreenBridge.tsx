"use client";

import * as React from "react";

const FALLBACK_CLASS = "chart-panel--fullscreen-fallback";
const LOCK_CLASS = "chart-fullscreen-lock";
const CHART_BUTTON_SELECTOR = ".chart-panel .chart-tools button";

function getFullscreenButton(target: Element | null) {
  const button = target?.closest<HTMLButtonElement>(CHART_BUTTON_SELECTOR) ?? null;
  if (!button) return null;
  const label = button.textContent?.trim();
  if (button.dataset.chartFullscreen === "true" || label === "Full" || label === "Full Screen" || label === "Exit Full Screen") {
    return button;
  }
  return null;
}

function isPanelFullscreen(panel: HTMLElement) {
  return document.fullscreenElement === panel || panel.classList.contains(FALLBACK_CLASS);
}

function syncFullscreenButtons() {
  document.querySelectorAll<HTMLButtonElement>(CHART_BUTTON_SELECTOR).forEach((button) => {
    const label = button.textContent?.trim();
    if (button.dataset.chartFullscreen !== "true" && label !== "Full" && label !== "Full Screen" && label !== "Exit Full Screen") return;

    button.dataset.chartFullscreen = "true";
    const panel = button.closest<HTMLElement>(".chart-panel");
    const active = panel ? isPanelFullscreen(panel) : false;
    const nextLabel = active ? "Exit Full Screen" : "Full Screen";

    if (button.textContent !== nextLabel) button.textContent = nextLabel;
    button.setAttribute("aria-label", nextLabel);
    button.setAttribute("title", nextLabel);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function clearFallback(panel?: HTMLElement | null) {
  panel?.classList.remove(FALLBACK_CLASS);
  if (!document.querySelector(`.${FALLBACK_CLASS}`)) document.documentElement.classList.remove(LOCK_CLASS);
}

export function ChartFullscreenBridge() {
  React.useEffect(() => {
    let disposed = false;

    const decorate = () => {
      if (!disposed) syncFullscreenButtons();
    };

    const observer = new MutationObserver(decorate);
    observer.observe(document.body, { childList: true, subtree: true });
    decorate();

    const onClick = async (event: MouseEvent) => {
      const button = getFullscreenButton(event.target instanceof Element ? event.target : null);
      if (!button) return;

      button.dataset.chartFullscreen = "true";
      const panel = button.closest<HTMLElement>(".chart-panel");
      if (!panel) return;

      if (isPanelFullscreen(panel)) {
        if (document.fullscreenElement) {
          try {
            await document.exitFullscreen();
          } catch {
            clearFallback(panel);
          }
        } else {
          clearFallback(panel);
        }
        syncFullscreenButtons();
        return;
      }

      try {
        if (!panel.requestFullscreen) throw new Error("Fullscreen API unavailable");
        await panel.requestFullscreen();
      } catch {
        panel.classList.add(FALLBACK_CLASS);
        document.documentElement.classList.add(LOCK_CLASS);
      }

      syncFullscreenButtons();
    };

    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        document.querySelectorAll<HTMLElement>(`.${FALLBACK_CLASS}`).forEach((panel) => clearFallback(panel));
      }
      syncFullscreenButtons();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || document.fullscreenElement) return;
      const fallbackPanel = document.querySelector<HTMLElement>(`.${FALLBACK_CLASS}`);
      if (!fallbackPanel) return;
      clearFallback(fallbackPanel);
      syncFullscreenButtons();
    };

    document.addEventListener("click", onClick);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      disposed = true;
      observer.disconnect();
      document.removeEventListener("click", onClick);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("keydown", onKeyDown);
      document.querySelectorAll<HTMLElement>(`.${FALLBACK_CLASS}`).forEach((panel) => clearFallback(panel));
    };
  }, []);

  return (
    <style>{`
      .chart-panel:fullscreen,
      .chart-panel.${FALLBACK_CLASS} {
        width: 100vw !important;
        height: 100vh !important;
        max-width: none !important;
        max-height: none !important;
        margin: 0 !important;
        border-radius: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        background: #020b16 !important;
        overflow: hidden !important;
      }

      .chart-panel.${FALLBACK_CLASS} {
        position: fixed !important;
        inset: 0 !important;
        z-index: 10000 !important;
      }

      .chart-panel:fullscreen::backdrop {
        background: #020b16;
      }

      .chart-panel:fullscreen .live-chart,
      .chart-panel.${FALLBACK_CLASS} .live-chart,
      .chart-panel:fullscreen .empty-functional,
      .chart-panel.${FALLBACK_CLASS} .empty-functional {
        flex: 1 1 auto !important;
        width: 100% !important;
        height: auto !important;
        min-height: 0 !important;
      }

      .chart-panel:fullscreen .live-chart svg,
      .chart-panel.${FALLBACK_CLASS} .live-chart svg {
        width: 100% !important;
        height: 100% !important;
      }

      .chart-panel:fullscreen .trade-tabs.bottom,
      .chart-panel.${FALLBACK_CLASS} .trade-tabs.bottom,
      .chart-panel:fullscreen .overview-tiles,
      .chart-panel.${FALLBACK_CLASS} .overview-tiles {
        display: none !important;
      }

      .chart-panel .chart-tools button[data-chart-fullscreen="true"] {
        min-width: 76px;
        white-space: nowrap;
      }

      .chart-fullscreen-lock,
      .chart-fullscreen-lock body {
        overflow: hidden !important;
      }
    `}</style>
  );
}

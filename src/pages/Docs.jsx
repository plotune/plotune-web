// src/pages/Docs.jsx
import React, { lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import clsx from "clsx";

// ── SVG icons (same ones you use in Dashboard) ───────────────────────
import OverviewIcon from "../assets/icons/overview.svg";
import PuzzleIcon from "../assets/icons/extensions.svg";
import CalculatorIcon from "../assets/icons/billing.svg";
import PlugIcon from "../assets/icons/stream.svg";
import CodeIcon from "../assets/icons/profile.svg";
import ServerIcon from "../assets/icons/api.svg";

// ── Lazy-load every page component ─────────────────────────────────────
const pageMap = {
  general: lazy(() => import("./docs_pages/General.jsx")),
  nexus: lazy(() => import("./docs_pages/Nexus.jsx")),
  "nexus-remote-routing": lazy(() => import("./docs_pages/NexusRemoteRouting.jsx")),

  // Components
  "components-oscilloscope": lazy(() => import("./docs_pages/Components/Oscilloscope.jsx")),
  "components-scatter": lazy(() => import("./docs_pages/Components/Scatter.jsx")),
  "components-bridge": lazy(() => import("./docs_pages/Components/Bridge.jsx")),
  "components-statistical": lazy(() => import("./docs_pages/Components/Statistical.jsx")),
  "components-recorder": lazy(() => import("./docs_pages/Components/Recorder.jsx")),

  // Calculations
  "calculations-mathematical": lazy(() => import("./docs_pages/Calculations/Mathematical.jsx")),
  "calculations-aggregations": lazy(() => import("./docs_pages/Calculations/Aggregations.jsx")),
  "calculations-plotunex": lazy(() => import("./docs_pages/Calculations/Plotunex.jsx")),

  // Extensions
  "extensions-offline": lazy(() => import("./docs_pages/Extensions/Offline.jsx")),
  "extensions-online": lazy(() => import("./docs_pages/Extensions/Online.jsx")),
  "extensions-simulation": lazy(() => import("./docs_pages/Extensions/Simulation.jsx")),
  "extensions-bridging": lazy(() => import("./docs_pages/Extensions/Bridging.jsx")),

  sdk: lazy(() => import("./docs_pages/SDK.jsx")),
  //api: lazy(() => import("./docs_pages/API.jsx")),
};

// ── Tab definition (order matters) ─────────────────────────────────────
const tabs = [
  { id: "general", label: "General", Icon: OverviewIcon },
  {
    id: "nexus",
    label: "Nexus",
    Icon: ServerIcon,
    sub: [
      { id: "nexus", label: "Quick start" },
      { id: "nexus-remote-routing", label: "Remote routing" },
    ],
  },

  {
    id: "components",
    label: "Components",
    Icon: PuzzleIcon,
    sub: [
      { id: "components-oscilloscope", label: "Oscilloscope" },
      { id: "components-scatter", label: "Scatter" },
      { id: "components-bridge", label: "Bridge" },
      { id: "components-statistical", label: "Statistical" },
      { id: "components-recorder", label: "Recorder" },
    ],
  },

  {
    id: "calculations",
    label: "Calculations",
    Icon: CalculatorIcon,
    sub: [
      { id: "calculations-mathematical", label: "Mathematical" },
      { id: "calculations-aggregations", label: "Aggregations" },
      { id: "calculations-plotunex", label: "PTX" },
    ],
  },

  {
    id: "extensions",
    label: "Extensions",
    Icon: PlugIcon,
    sub: [
      { id: "extensions-offline", label: "Offline extensions" },
      { id: "extensions-online", label: "Online extensions" },
      { id: "extensions-simulation", label: "Simulation extensions" },
      { id: "extensions-bridging", label: "Bridging" },
    ],
  },

  { id: "sdk", label: "SDK", Icon: CodeIcon },
  // { id: "api", label: "API", Icon: ServerIcon },
];

// ── Helper: first page of a main tab (fallback) ───────────────────────
const getDefaultPageForTab = (tabId) => {
  const tab = tabs.find((t) => t.id === tabId);
  if (tab?.sub?.length) return tab.sub[0].id;
  return tabId;
};

export default function Docs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlPage = searchParams.get("page") || "general";

  // Resolve active main tab
  const activeMainTab =
    tabs.find(
      (t) => t.id === urlPage || t.sub?.some((s) => s.id === urlPage)
    )?.id || "general";

  // Resolve component
  const Component =
    pageMap[urlPage] || pageMap[getDefaultPageForTab(activeMainTab)];

  const selectPage = (pageId) => {
    setSearchParams({ page: pageId });
  };

  // ── Render a single tab (main or sub) ─────────────────────────────────
  const renderTab = (tab, isSub = false) => {
    const isActive = urlPage === tab.id;
    const baseCls = clsx(
      "w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3",
      isSub ? "pl-12 text-sm" : "font-medium",
      isActive
        ? "bg-primary/20 text-primary border-l-4 border-primary"
        : "text-gray-text hover:text-light-text hover:bg-white/5"
    );

    return (
      <button
        key={tab.id}
        onClick={() => selectPage(tab.id)}
        className={baseCls}
      >
        {tab.Icon && (
          <img src={tab.Icon} alt="" className="w-5 h-5 opacity-70" />
        )}
        {tab.label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* ── HERO ── */}
      <section className="min-h-[40vh] flex flex-col justify-center py-16 bg-gradient-to-br from-primary/10 to-secondary/10 text-center">
        <div className="container mx-auto px-5">
          <h1 className="text-4xl md:text-5xl font-bold text-light-text mb-4">
            Plotune Gateway Documentation
          </h1>
          <p className="text-lg text-gray-text max-w-2xl mx-auto">
            Explore components, calculations, extensions, SDK and API.
          </p>
        </div>
      </section>

      {/* ── LAYOUT ── */}
      <div className="container mx-auto px-5 py-12 flex flex-col lg:flex-row gap-8">
        {/* ── LEFT: Sidebar ── */}
        <aside className="lg:w-1/4">
          <div className="bg-dark-card rounded-2xl p-6 border border-white/5 shadow-xl">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <div key={tab.id}>
                  {renderTab(tab)}
                  {tab.sub && activeMainTab === tab.id && (
                    <div className="mt-1 space-y-1">
                      {tab.sub.map((sub) => renderTab(sub, true))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* ── RIGHT: Content ── */}
        <main className="lg:w-3/4">
          <div className="bg-dark-card rounded-2xl p-8 border border-white/5 shadow-xl min-h-[600px]">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              }
            >
              <Component />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}

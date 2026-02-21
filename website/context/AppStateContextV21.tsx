"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import type { Artwork } from "../lib/v21-artworks";
import type { V2Gallery } from "../lib/v2-galleries";

export interface ImplicitSignal {
  type: "dwell" | "save";
  artworkId: number;
  keywords: string[];
  at: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  at?: number;
}

export type AgentScreen =
  | "browse"
  | "artwork"
  | "gallery"
  | "collection"
  | "profile";

export interface AgentContext {
  screen: AgentScreen;
  entityId: string | null;
  entityName: string | null;
  entityType: "artwork" | "gallery" | "artist" | null;
  description: string | null;
}

export interface AgentMemory {
  keyInsights: string[];
  mentionedArtworks: number[];
  collectorMilestones: string[];
  lastActive: string | null;
}

export interface AgentState {
  isOpen: boolean;
  inputFocused: boolean;
  currentContext: AgentContext | null;
  history: Message[];
  memory: AgentMemory;
  suggestedChips: string[];
  preloadQuestion: string | null;
  postVisitRitual: boolean;
}

export interface CollectorProfile {
  identity: string | null;
  keywords: string[];
  bridge: string;
  implicitSignals: ImplicitSignal[];
  quizAnswers: string[];
  profileComplete: boolean;
  onboardingComplete: boolean;
}

export interface JourneyState {
  onboardingComplete: boolean;
  firstSaveAt: number | null;
  totalSaves: number;
  visitKitOpenedFor: string[];
  identityRevealed: boolean;
  postVisitGalleries: string[];
  firstSaveToastShown: boolean;
  fifthSaveToastShown: boolean;
}

interface AppStateV21 {
  hasCompletedOnboarding: boolean;
  collectorProfile: CollectorProfile;
  savedArtworks: Artwork[];
  savedGalleries: V2Gallery[];
  agent: AgentState;
  journey: JourneyState;
}

const STORAGE_KEY = "curator-mind-v21-state";

const defaultProfile: CollectorProfile = {
  identity: null,
  keywords: [],
  bridge: "",
  implicitSignals: [],
  quizAnswers: [],
  profileComplete: false,
  onboardingComplete: false,
};

const defaultJourney: JourneyState = {
  onboardingComplete: false,
  firstSaveAt: null,
  totalSaves: 0,
  visitKitOpenedFor: [],
  identityRevealed: false,
  postVisitGalleries: [],
  firstSaveToastShown: false,
  fifthSaveToastShown: false,
};

const defaultAgentState: AgentState = {
  isOpen: false,
  inputFocused: false,
  currentContext: null,
  history: [],
  memory: {
    keyInsights: [],
    mentionedArtworks: [],
    collectorMilestones: [],
    lastActive: null,
  },
  suggestedChips: [],
  preloadQuestion: null,
  postVisitRitual: false,
};

const defaultState: AppStateV21 = {
  hasCompletedOnboarding: false,
  collectorProfile: defaultProfile,
  savedArtworks: [],
  savedGalleries: [],
  agent: defaultAgentState,
  journey: defaultJourney,
};

function loadState(): AppStateV21 {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<AppStateV21> & {
      agentHistory?: Message[];
    };
    const migratedAgent: AgentState = parsed.agent
      ? {
          ...defaultAgentState,
          ...parsed.agent,
          memory: { ...defaultAgentState.memory, ...parsed.agent.memory },
          preloadQuestion: (parsed.agent as AgentState).preloadQuestion ?? null,
          postVisitRitual: (parsed.agent as AgentState).postVisitRitual ?? false,
        }
      : {
          ...defaultAgentState,
          history:
            Array.isArray(parsed.agentHistory) && parsed.agentHistory.length > 0
              ? parsed.agentHistory.map((m) => ({ ...m, at: (m as Message).at ?? Date.now() }))
              : [],
        };
    return {
      ...defaultState,
      ...parsed,
      collectorProfile: { ...defaultProfile, ...parsed.collectorProfile, onboardingComplete: (parsed.collectorProfile as CollectorProfile)?.onboardingComplete ?? parsed.collectorProfile?.profileComplete ?? false },
      journey: { ...defaultJourney, ...(parsed as AppStateV21).journey },
      agent: migratedAgent,
    };
  } catch {
    return defaultState;
  }
}

function saveState(state: AppStateV21) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

type ContextValue = AppStateV21 & {
  agentHistory: Message[];
  hydrated: boolean;
  setHasCompletedOnboarding: (v: boolean) => void;
  addImplicitSignal: (signal: Omit<ImplicitSignal, "at">) => void;
  setCollectorProfileFromQuiz: (
    identity: string,
    keywords: string[],
    bridge: string,
    quizAnswers?: string[]
  ) => void;
  toggleSavedArtwork: (artwork: Artwork) => void;
  isArtworkSaved: (artworkId: number) => boolean;
  addSavedGallery: (gallery: V2Gallery) => void;
  removeSavedGallery: (id: string) => void;
  setAgentOpen: (open: boolean) => void;
  setAgentInputFocused: (focused: boolean) => void;
  setAgentContext: (ctx: AgentContext | null) => void;
  setAgentMemory: (update: Partial<AgentMemory> | ((prev: AgentMemory) => AgentMemory)) => void;
  setSuggestedChips: (chips: string[]) => void;
  setAgentPreloadQuestion: (q: string | null) => void;
  setAgentPostVisitRitual: (v: boolean) => void;
  setAgentHistory: (history: Message[] | ((prev: Message[]) => Message[])) => void;
  appendAgentMessage: (msg: Message) => void;
  updateAgentMessage: (id: string, content: string) => void;
  signalsUntilProfile: () => number;
  dominantKeywordCluster: () => string | null;
  shouldShowQuizTrigger: () => boolean;
  recordFirstSave: () => void;
  recordVisitKitOpened: (galleryId: string) => void;
  recordIdentityRevealed: () => void;
  recordPostVisitGallery: (galleryName: string) => void;
  completeOnboardingWithSignals: (signals: ImplicitSignal[]) => void;
  markFirstSaveToastShown: () => void;
  markFifthSaveToastShown: () => void;
};

const AppStateContextV21 = createContext<ContextValue | null>(null);

const SIGNALS_NEEDED = 5;
const SIGNALS_SAME_CLUSTER_FOR_QUIZ = 3;

export function AppStateProviderV21({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppStateV21>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveState(state);
  }, [state, hydrated]);

  const setHasCompletedOnboarding = useCallback((v: boolean) => {
    setState((s) => ({
      ...s,
      hasCompletedOnboarding: v,
      journey: { ...s.journey, onboardingComplete: v },
      collectorProfile: { ...s.collectorProfile, onboardingComplete: v },
    }));
  }, []);

  const addImplicitSignal = useCallback((signal: Omit<ImplicitSignal, "at">) => {
    setState((s) => {
      const signals = s.collectorProfile.implicitSignals;
      if (signal.type === "dwell") {
        const already = signals.some(
          (x) => x.type === "dwell" && x.artworkId === signal.artworkId
        );
        if (already) return s;
      }
      return {
        ...s,
        collectorProfile: {
          ...s.collectorProfile,
          implicitSignals: [...signals, { ...signal, at: Date.now() }],
        },
      };
    });
  }, []);

  const setCollectorProfileFromQuiz = useCallback(
    (identity: string, keywords: string[], bridge: string, quizAnswers?: string[]) => {
      setState((s) => ({
        ...s,
        collectorProfile: {
          ...s.collectorProfile,
          identity,
          keywords,
          bridge,
          profileComplete: true,
          quizAnswers: quizAnswers ?? s.collectorProfile.quizAnswers,
        },
      }));
    },
    []
  );

  const toggleSavedArtwork = useCallback((artwork: Artwork) => {
    setState((s) => {
      const exists = s.savedArtworks.some((a) => a.id === artwork.id);
      const newSaves = exists
        ? s.savedArtworks.filter((a) => a.id !== artwork.id)
        : [...s.savedArtworks, artwork];
      const totalSaves = newSaves.length;
      const journey = { ...s.journey, totalSaves };
      if (!exists && !s.journey.firstSaveAt) {
        journey.firstSaveAt = Date.now();
      }
      return {
        ...s,
        savedArtworks: newSaves,
        journey,
      };
    });
  }, []);

  const isArtworkSaved = useCallback(
    (artworkId: number) => state.savedArtworks.some((a) => a.id === artworkId),
    [state.savedArtworks]
  );

  const addSavedGallery = useCallback((gallery: V2Gallery) => {
    setState((s) => ({
      ...s,
      savedGalleries: s.savedGalleries.some((g) => g.id === gallery.id)
        ? s.savedGalleries
        : [...s.savedGalleries, gallery],
    }));
  }, []);

  const removeSavedGallery = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      savedGalleries: s.savedGalleries.filter((g) => g.id !== id),
    }));
  }, []);

  const setAgentOpen = useCallback((isOpen: boolean) => {
    setState((s) => ({
      ...s,
      agent: { ...s.agent, isOpen, memory: { ...s.agent.memory, lastActive: new Date().toISOString() } },
    }));
  }, []);

  const setAgentInputFocused = useCallback((inputFocused: boolean) => {
    setState((s) => ({ ...s, agent: { ...s.agent, inputFocused } }));
  }, []);

  const setAgentContext = useCallback((currentContext: AgentContext | null) => {
    setState((s) => ({ ...s, agent: { ...s.agent, currentContext } }));
  }, []);

  const setAgentMemory = useCallback(
    (update: Partial<AgentMemory> | ((prev: AgentMemory) => AgentMemory)) => {
      setState((s) => ({
        ...s,
        agent: {
          ...s.agent,
          memory: typeof update === "function" ? update(s.agent.memory) : { ...s.agent.memory, ...update },
        },
      }));
    },
    []
  );

  const setSuggestedChips = useCallback((suggestedChips: string[]) => {
    setState((s) => ({ ...s, agent: { ...s.agent, suggestedChips } }));
  }, []);

  const setAgentPreloadQuestion = useCallback((preloadQuestion: string | null) => {
    setState((s) => ({ ...s, agent: { ...s.agent, preloadQuestion } }));
  }, []);

  const setAgentPostVisitRitual = useCallback((postVisitRitual: boolean) => {
    setState((s) => ({ ...s, agent: { ...s.agent, postVisitRitual } }));
  }, []);

  const setAgentHistory = useCallback(
    (history: Message[] | ((prev: Message[]) => Message[])) => {
      setState((s) => ({
        ...s,
        agent: {
          ...s.agent,
          history: typeof history === "function" ? history(s.agent.history) : history,
        },
      }));
    },
    []
  );

  const appendAgentMessage = useCallback((msg: Message) => {
    const withAt = { ...msg, at: msg.at ?? Date.now() };
    setState((s) => ({
      ...s,
      agent: { ...s.agent, history: [...s.agent.history, withAt] },
    }));
  }, []);

  const updateAgentMessage = useCallback((id: string, content: string) => {
    setState((s) => ({
      ...s,
      agent: {
        ...s.agent,
        history: s.agent.history.map((m) => (m.id === id ? { ...m, content } : m)),
      },
    }));
  }, []);

  const signalsUntilProfile = useCallback(() => {
    const n = state.collectorProfile.implicitSignals.length;
    return Math.max(0, SIGNALS_NEEDED - n);
  }, [state.collectorProfile.implicitSignals.length]);

  const dominantKeywordCluster = useCallback((): string | null => {
    const signals = state.collectorProfile.implicitSignals;
    const count: Record<string, number> = {};
    signals.forEach((s) => {
      s.keywords.forEach((k) => {
        count[k] = (count[k] || 0) + 1;
      });
    });
    const entries = Object.entries(count).sort((a, b) => b[1] - a[1]);
    const top = entries[0];
    return top && top[1] >= SIGNALS_SAME_CLUSTER_FOR_QUIZ ? top[0] : null;
  }, [state.collectorProfile.implicitSignals]);

  const shouldShowQuizTrigger = useCallback(() => {
    if (state.collectorProfile.profileComplete) return false;
    return dominantKeywordCluster() !== null;
  }, [state.collectorProfile.profileComplete, dominantKeywordCluster]);

  const recordFirstSave = useCallback(() => {
    setState((s) => {
      if (s.journey.firstSaveAt) return s;
      return { ...s, journey: { ...s.journey, firstSaveAt: Date.now(), totalSaves: Math.max(s.journey.totalSaves, 1) } };
    });
  }, []);

  const recordVisitKitOpened = useCallback((galleryId: string) => {
    setState((s) => {
      if (s.journey.visitKitOpenedFor.includes(galleryId)) return s;
      return { ...s, journey: { ...s.journey, visitKitOpenedFor: [...s.journey.visitKitOpenedFor, galleryId] } };
    });
  }, []);

  const recordIdentityRevealed = useCallback(() => {
    setState((s) => {
      if (s.journey.identityRevealed) return s;
      return { ...s, journey: { ...s.journey, identityRevealed: true } };
    });
  }, []);

  const recordPostVisitGallery = useCallback((galleryName: string) => {
    setState((s) => {
      if (s.journey.postVisitGalleries.includes(galleryName)) return s;
      return { ...s, journey: { ...s.journey, postVisitGalleries: [...s.journey.postVisitGalleries, galleryName] } };
    });
  }, []);

  const completeOnboardingWithSignals = useCallback((signals: ImplicitSignal[]) => {
    setState((s) => ({
      ...s,
      hasCompletedOnboarding: true,
      collectorProfile: {
        ...s.collectorProfile,
        implicitSignals: [...s.collectorProfile.implicitSignals, ...signals.map((sig) => ({ ...sig, at: sig.at ?? Date.now() }))],
        onboardingComplete: true,
      },
      journey: { ...s.journey, onboardingComplete: true },
    }));
  }, []);

  const markFirstSaveToastShown = useCallback(() => {
    setState((s) => ({ ...s, journey: { ...s.journey, firstSaveToastShown: true } }));
  }, []);
  const markFifthSaveToastShown = useCallback(() => {
    setState((s) => ({ ...s, journey: { ...s.journey, fifthSaveToastShown: true } }));
  }, []);

  const value: ContextValue = {
    ...state,
    agentHistory: state.agent.history,
    hydrated,
    setHasCompletedOnboarding,
    addImplicitSignal,
    setCollectorProfileFromQuiz,
    toggleSavedArtwork,
    isArtworkSaved,
    addSavedGallery,
    removeSavedGallery,
    setAgentOpen,
    setAgentInputFocused,
    setAgentContext,
    setAgentMemory,
    setSuggestedChips,
    setAgentPreloadQuestion,
    setAgentPostVisitRitual,
    setAgentHistory,
    appendAgentMessage,
    updateAgentMessage,
    signalsUntilProfile,
    dominantKeywordCluster,
    shouldShowQuizTrigger,
    recordFirstSave,
    recordVisitKitOpened,
    recordIdentityRevealed,
    recordPostVisitGallery,
    completeOnboardingWithSignals,
    markFirstSaveToastShown,
    markFifthSaveToastShown,
  };

  return (
    <AppStateContextV21.Provider value={value}>{children}</AppStateContextV21.Provider>
  );
}

export function useAppStateV21() {
  const ctx = useContext(AppStateContextV21);
  if (!ctx) throw new Error("useAppStateV21 must be used within AppStateProviderV21");
  return ctx;
}

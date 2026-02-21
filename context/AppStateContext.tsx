"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";

export interface Gallery {
  id: string;
  name: string;
  neighborhood: string;
  exhibition: string;
  matchReason: string;
  address?: string;
  metro?: string;
  arrondissement?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  saved?: boolean;
}

interface AppState {
  hasCompletedOnboarding: boolean;
  quizAnswers: string[] | null;
  collectorIdentity: string;
  keywords: string[];
  bridgeSentence: string;
  savedGalleries: Gallery[];
  agentHistory: Message[];
}

const STORAGE_KEY = "curator-mind-v2-state";

const defaultState: AppState = {
  hasCompletedOnboarding: false,
  quizAnswers: null,
  collectorIdentity: "",
  keywords: [],
  bridgeSentence: "",
  savedGalleries: [],
  agentHistory: [],
};

function loadState(): AppState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return { ...defaultState, ...parsed };
  } catch {
    return defaultState;
  }
}

function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

type AppStateContextValue = AppState & {
  hydrated: boolean;
  setHasCompletedOnboarding: (v: boolean) => void;
  setQuizAnswers: (answers: string[]) => void;
  setCollectorProfile: (identity: string, keywords: string[], bridge: string) => void;
  addSavedGallery: (gallery: Gallery) => void;
  removeSavedGallery: (id: string) => void;
  setAgentHistory: (history: Message[] | ((prev: Message[]) => Message[])) => void;
  appendAgentMessage: (msg: Message) => void;
  updateAgentMessage: (id: string, content: string) => void;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
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
    setState((s) => ({ ...s, hasCompletedOnboarding: v }));
  }, []);

  const setQuizAnswers = useCallback((quizAnswers: string[]) => {
    setState((s) => ({ ...s, quizAnswers }));
  }, []);

  const setCollectorProfile = useCallback(
    (collectorIdentity: string, keywords: string[], bridgeSentence: string) => {
      setState((s) => ({
        ...s,
        collectorIdentity,
        keywords,
        bridgeSentence,
      }));
    },
    []
  );

  const addSavedGallery = useCallback((gallery: Gallery) => {
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

  const setAgentHistory = useCallback(
    (agentHistory: Message[] | ((prev: Message[]) => Message[])) => {
      setState((s) => ({
        ...s,
        agentHistory:
          typeof agentHistory === "function" ? agentHistory(s.agentHistory) : agentHistory,
      }));
    },
    []
  );

  const appendAgentMessage = useCallback((msg: Message) => {
    setState((s) => ({ ...s, agentHistory: [...s.agentHistory, msg] }));
  }, []);

  const updateAgentMessage = useCallback((id: string, content: string) => {
    setState((s) => ({
      ...s,
      agentHistory: s.agentHistory.map((m) =>
        m.id === id ? { ...m, content } : m
      ),
    }));
  }, []);

  const value: AppStateContextValue = {
    ...state,
    hydrated,
    setHasCompletedOnboarding,
    setQuizAnswers,
    setCollectorProfile,
    addSavedGallery,
    removeSavedGallery,
    setAgentHistory,
    appendAgentMessage,
    updateAgentMessage,
  };

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}

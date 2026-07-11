import { createContext, useContext } from 'react';

export interface Shortcut {
  key: string;
  description: string;
  action: () => void;
  category: 'navigation' | 'ui' | 'actions' | 'dev';
  modifiers?: ('ctrl' | 'alt' | 'shift' | 'meta')[];
}

interface KeyboardContextType {
  addShortcut: (shortcut: Shortcut) => void;
  removeShortcut: (key: string) => void;
  toggleHelp: () => void;
}

const noopKeyboardContext: KeyboardContextType = {
  addShortcut: () => undefined,
  removeShortcut: () => undefined,
  toggleHelp: () => undefined,
};

export const KeyboardContext = createContext<KeyboardContextType | null>(null);

export const useKeyboard = () => {
  return useContext(KeyboardContext) ?? noopKeyboardContext;
};

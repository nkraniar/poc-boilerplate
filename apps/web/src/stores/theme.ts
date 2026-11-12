import { create } from 'zustand'

type ThemeStore = {
  dark: boolean
  toggleTheme: () => void
}

const themeKey = 'poc-theme'

function getInitialTheme() {
  const saved = localStorage.getItem(themeKey)
  if (saved === 'dark' || saved === 'light') return saved === 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  dark: getInitialTheme(),
  toggleTheme: () => {
    const dark = !get().dark
    localStorage.setItem(themeKey, dark ? 'dark' : 'light')
    set({ dark })
  },
}))

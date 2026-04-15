import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  isDark: boolean
  toggle: () => void
}

// Persisted under 'hb-tech-theme-v2'.
// The key was bumped to v2 to clear old localStorage values from previous
// iterations of the theme system. If the default changes again, bump it.
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: false,
      toggle: () => set((state) => ({ isDark: !state.isDark })),
    }),
    { name: 'hb-tech-theme-v2' }
  )
)

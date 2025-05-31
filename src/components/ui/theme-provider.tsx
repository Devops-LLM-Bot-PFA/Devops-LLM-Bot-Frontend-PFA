
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // The hook error happens because the component tries to use React context
  // outside a React tree. Let's ensure we're rendering within React.
  const [mounted, setMounted] = React.useState(false)

  // Only render the provider when mounted on client side to avoid SSR issues
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Return children directly during SSR/initial render to prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

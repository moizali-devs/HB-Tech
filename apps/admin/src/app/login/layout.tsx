/** Prevents static prerender of /login so client-only code (e.g. URL params in useEffect) never runs during build. */
export const dynamic = 'force-dynamic'

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

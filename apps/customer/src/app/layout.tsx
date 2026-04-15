import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import Header from '@/components/Header'
import CartDrawer from '@/components/CartDrawer'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'HB Tech & Gaming Computer Hardware & Gaming Store',
  description:
    'Shop the latest computer hardware, gaming peripherals, and tech accessories at HB Tech & Gaming. New, used, and refurbished products at great prices.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Prevent flash of wrong theme on first load */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=JSON.parse(localStorage.getItem('hb-tech-theme-v2')||'{}');if(t.state&&t.state.isDark===true)document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');}catch(e){document.documentElement.classList.remove('dark');}})();`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <ThemeProvider>
          <Header />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}


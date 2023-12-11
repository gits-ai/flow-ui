import "@/styles/globals.css"

import { Inter } from "next/font/google"
import { cookies } from "next/headers"

import { TRPCReactProvider } from "@/trpc/react"
import { Toaster } from "sonner"
import { PropsWithChildren } from "react"
import DiagramProvider from "@/providers/diagram-provider"
import MyThemeProvider from "@/providers/theme-provider"
import { clsx } from "clsx"
import { ErrorBoundary } from "next/dist/client/components/error-boundary"
import UserProvider from "@/providers/user-provider"

import { baseMetadata } from "@/config/app"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = baseMetadata

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      suppressHydrationWarning // next-theme ssr
    >
      <body
        className={clsx(
          "font-sans",
          inter.variable,
          "w-screen h-screen relative",
        )}
      >
        <TRPCReactProvider cookies={cookies().toString()}>
          <UserProvider>
            <MyThemeProvider>
              <DiagramProvider>{children}</DiagramProvider>
            </MyThemeProvider>
          </UserProvider>
        </TRPCReactProvider>
      </body>

      <Toaster richColors position={"top-right"} />
    </html>
  )
}

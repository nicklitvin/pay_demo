import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import Header from './_components/header'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pay Demo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
        <html lang="en">
            <body className={inter.className}>
                <Toaster/>
                <div className="flex flex-col w-full h-fit min-h-full bg-red-300">
                    <Header/>
                    <div className="p-3">
                        {children}
                    </div>
                </div>
            </body>
        </html>
    </ClerkProvider>
  )
}

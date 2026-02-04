"use client"

import { BottomNav } from "@/components/bottom-nav"

export default function MeuCartaoLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-[100dvh] bg-white pb-20">
            {children}
            <BottomNav />
        </div>
    )
}

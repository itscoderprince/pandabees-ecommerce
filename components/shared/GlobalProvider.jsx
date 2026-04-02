"use client"

import React, { useState } from "react"
import dynamic from "next/dynamic"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"

import { store, persistor } from "@/store/store"
import Loading from "./Loading"

// Lazy load Devtools to keep the initial client bundle small
const ReactQueryDevtools = dynamic(
    () => import('@tanstack/react-query-devtools').then((mod) => mod.ReactQueryDevtools),
    { ssr: false }
)

/**
 * GlobalProvider - Professional-grade root wrapper for application-wide state.
 * Implements lazy initialization for QueryClient to ensure stability during hydration.
 */
const GlobalProvider = ({ children }) => {
    // Lazy-init the QueryClient to prevent recreation across re-renders
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
                refetchOnWindowFocus: false, // Prevents excessive refetching in production
                retry: 1, // Minimal retries for a snappier experience during failures
            },
        },
    }))

    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <PersistGate loading={<Loading />} persistor={persistor}>
                    {children}
                </PersistGate>
            </Provider>

            {/* Devtools is dynamically loaded and only active in development process */}
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} />
            )}
        </QueryClientProvider>
    )
}

export default GlobalProvider;

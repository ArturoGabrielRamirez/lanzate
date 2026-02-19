"use client"

import '@bprogress/core/css';
import { ProgressProvider } from '@bprogress/next/app';

function ProgressBar({ children }: React.PropsWithChildren) {
    return (
        <ProgressProvider
            shallowRouting={true}
            options={{ showSpinner: true }}
            spinnerPosition="bottom-right"
            startOnLoad={true}
            color='var(--primary)'
        >
            {children}
        </ProgressProvider>
    )
}

export { ProgressBar }
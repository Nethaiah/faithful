import { AppContent } from '@/components/app-content';
import { Navigation } from '@/components/navigation';
import { AppShell } from '@/components/app-shell';
import type { PropsWithChildren } from 'react';

export default function AppHeaderLayout({ children }: PropsWithChildren) {
    return (
        <AppShell>
            <Navigation />
            <AppContent>{children}</AppContent>
        </AppShell>
    );
}

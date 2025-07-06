import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { SharedData, } from '@/types';

export function usePreventBackNavigation() {
    const { auth } = usePage<SharedData>().props;

    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            // If user is not authenticated and trying to navigate back, redirect to login
            if (!auth.user) {
                event.preventDefault();
                window.location.href = '/login';
            }
        };

        // Add event listeners
        window.addEventListener('popstate', handlePopState);

        // Cleanup
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [auth.user]);
}

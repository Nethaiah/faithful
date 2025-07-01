import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: '/settings/profile',
        icon: null,
    },
    {
        title: 'Password',
        href: '/settings/password',
        icon: null,
    }
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-8 lg:space-y-0">
                <aside className="w-full lg:w-64">
                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <nav className="space-y-1">
                                {sidebarNavItems.map((item) => (
                                    <Button
                                        key={item.href}
                                        variant="ghost"
                                        asChild
                                        className={cn(
                                            'w-full justify-start text-muted-foreground hover:text-foreground',
                                            currentPath === item.href && 'bg-muted text-foreground'
                                        )}
                                    >
                                        <Link href={item.href} prefetch>
                                            {item.title}
                                        </Link>
                                    </Button>
                                ))}
                            </nav>
                        </CardContent>
                    </Card>
                </aside>

                <div className="flex-1">
                    <Card className="border-border">
                        <CardContent className="p-6">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

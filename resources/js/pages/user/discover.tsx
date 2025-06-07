import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { MoodDiscovery } from '@/components/discover';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Discover',
        href: route('discover'),
    },
];

export default function Discover() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <MoodDiscovery />
        </AppLayout>
    );
}

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { DevotionView, type DevotionData } from '@/components/devotion-view';

interface ViewDevotionProps {
    devotion: DevotionData;
}

const breadcrumbs = (devotionTitle: string): BreadcrumbItem[] => [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
    {
        title: 'Devotions',
        href: route('dashboard'),
    },
    {
        title: devotionTitle,
        href: '#',
    },
];

export default function ViewDevotion({ devotion }: ViewDevotionProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs(devotion.title)}>
            <DevotionView devotion={devotion} />
        </AppLayout>
    );
}

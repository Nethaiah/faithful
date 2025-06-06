import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { DevotionCreation } from '@/components/user-create-devotion';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Devotion',
        href: route('devotion.create'),
    },
];

export default function CreateDevotion() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <DevotionCreation />
        </AppLayout>
    );
}

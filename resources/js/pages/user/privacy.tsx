import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PrivacyControls } from '@/components/post-privacy';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Privacy',
        href: route('privacy'),
    },
];

export default function Privacy() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <PrivacyControls />
        </AppLayout>
    );
}

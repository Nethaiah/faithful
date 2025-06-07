import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { CommunityPosts } from '@/components/community-posts'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Community',
        href: route('community'),
    },
];

export default function Community() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <CommunityPosts />
        </AppLayout>
    );
}

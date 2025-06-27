import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { CommunityPosts } from '@/components/community-posts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Community',
        href: route('community'),
    },
];

interface CommunityPageProps {
    devotions: {
        data: Array<{
            id: number;
            title: string;
            content: string;
            verse: string;
            mood: string;
            created_at: string;
            emotions_count?: number;
            user: {
                id: number;
                name: string;
                avatar?: string;
            };
        }>;
        next_page_url: string | null;
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        has_more_pages: boolean;
        has_previous_pages: boolean;
    };
    filters: {
        mood?: string;
        search?: string;
    };
    moods: string[];
    stats: {
        totalUsers: number;
        totalDevotions: number;
        moodCounts: Record<string, number>;
    };
}

export default function Community({ devotions, filters, moods, stats }: CommunityPageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <CommunityPosts
                initialDevotions={devotions}
                filters={filters}
                moods={moods}
                stats={stats}
            />
        </AppLayout>
    );
}

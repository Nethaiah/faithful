import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { CommunityPosts, type Devotion } from '@/components/community-posts';

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
            verse_content?: string;
            mood: string;
            created_at: string;
            updated_at?: string;
            is_private?: boolean;
            emotions_count?: number;
            user: {
                id: number;
                name: string;
                email: string;
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

function transformToDevotion(devotion: {
    id: number;
    title: string;
    content: string;
    verse: string;
    verse_content?: string;
    mood: string;
    created_at: string;
    updated_at?: string;
    is_private?: boolean;
    emotions_count?: number;
    user: {
        id: number;
        name: string;
        email: string;
        avatar?: string;
    };
}): Devotion {
    return {
        ...devotion,
        verse_content: devotion.verse_content || '',
        updated_at: devotion.updated_at || new Date().toISOString(),
        is_private: devotion.is_private ?? false,
        user: {
            id: devotion.user.id,
            name: devotion.user.name,
            email: devotion.user.email || '',
            avatar: devotion.user.avatar
        }
    };
}

export default function Community({ devotions, filters, moods, stats }: CommunityPageProps) {
    const transformedDevotions = {
        ...devotions,
        data: devotions.data.map(transformToDevotion)
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <CommunityPosts
                initialDevotions={transformedDevotions}
                filters={filters}
                moods={moods}
                stats={stats}
            />
        </AppLayout>
    );
}

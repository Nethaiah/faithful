import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import UserDashboard from '@/components/dashboard';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
];

interface DashboardProps {
    devotions: Array<{
        id: number;
        title: string;
        verse: string;
        mood: string;
        isPublic: boolean;
        createdAt: string;
        excerpt: string;
    }>;
    pagination: {
        hasMorePages: boolean;
        hasPreviousPages: boolean;
        currentPage: number;
        lastPage: number;
        perPage: number;
        total: number;
    };
    filters: {
        search?: string;
        filterPrivacy?: string;
    };
    stats: {
        totalDevotions: number;
        publicDevotions: number;
        privateDevotions: number;
        lastDevotion: {
            id: number;
            title: string;
            created_at: string;
            is_private: boolean;
        } | null;
    };
}

export default function Dashboard({ devotions = [], pagination, filters, stats }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <UserDashboard devotions={devotions} pagination={pagination} filters={filters} stats={stats} />
        </AppLayout>
    );
}

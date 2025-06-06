import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import UserDashboard from '@/components/user-dashboard';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <UserDashboard />
        </AppLayout>
    );
}

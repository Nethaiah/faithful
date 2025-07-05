import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

import { CheckCircle2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    name: string;
    email: string;
}

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        email: auth.user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight">Profile Information</h2>
                        <p className="text-muted-foreground">
                            Update your account's profile information and email address.
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Profile Details</CardTitle>
                            <CardDescription>
                                Update your name and email address
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            autoComplete="name"
                                            placeholder="Full name"
                                            className="max-w-md"
                                        />
                                        <InputError message={errors.name} className="mt-1" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                            autoComplete="username"
                                            placeholder="Email address"
                                            className="max-w-md"
                                        />
                                        <InputError message={errors.email} className="mt-1" />
                                    </div>

                                    {mustVerifyEmail && auth.user.email_verified_at === null && (
                                        <div className="space-y-2">
                                            <div className="rounded-md border border-amber-100 bg-amber-50 p-4">
                                                <p className="text-sm text-amber-800">
                                                    Your email address is unverified.{' '}
                                                    <Link
                                                        href={route('verification.send')}
                                                        method="post"
                                                        as="button"
                                                        className="font-medium text-amber-900 underline underline-offset-2 hover:text-amber-950"
                                                    >
                                                        Click here to resend the verification email.
                                                    </Link>
                                                </p>
                                            </div>

                                            {status === 'verification-link-sent' && (
                                                <div className="mt-2 flex items-center gap-2 rounded-md border border-green-100 bg-green-50 p-4 text-sm text-green-700">
                                                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                                                    <p>A new verification link has been sent to your email address.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center pt-2">
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Saving...' : 'Save changes'}
                                        </Button>

                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition-opacity duration-300"
                                            enterFrom="opacity-0"
                                            enterTo="opacity-100"
                                            leave="transition-opacity duration-300"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="ml-4 text-sm text-green-600">Saved successfully!</p>
                                        </Transition>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Delete Account</CardTitle>
                            <CardDescription>
                                Permanently delete your account and all of its data.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="max-w-2xl text-sm text-muted-foreground">
                                <p>
                                    Once your account is deleted, all of its resources and data will be permanently deleted.
                                    Before deleting your account, please download any data or information that you wish to retain.
                                </p>
                                <div className="mt-6">
                                    <Button variant="destructive">
                                        Delete Account
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}

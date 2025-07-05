import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

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
        title: 'Password settings',
        href: '/settings/password',
    },
];

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Password Settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight">Update Password</h2>
                        <p className="text-muted-foreground">
                            Ensure your account is using a long, random password to stay secure.
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Change Password</CardTitle>
                            <CardDescription>
                                Update your account password
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={updatePassword} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="current_password">Current Password</Label>
                                        <Input
                                            id="current_password"
                                            ref={currentPasswordInput}
                                            value={data.current_password}
                                            onChange={(e) => setData('current_password', e.target.value)}
                                            type="password"
                                            autoComplete="current-password"
                                            placeholder="Enter your current password"
                                            className="max-w-md"
                                        />
                                        <InputError message={errors.current_password} className="mt-1" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">New Password</Label>
                                        <Input
                                            id="password"
                                            ref={passwordInput}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            type="password"
                                            autoComplete="new-password"
                                            placeholder="Enter a new password"
                                            className="max-w-md"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Use 8 or more characters with a mix of letters, numbers & symbols.
                                        </p>
                                        <InputError message={errors.password} className="mt-1" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                        <Input
                                            id="password_confirmation"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            type="password"
                                            autoComplete="new-password"
                                            placeholder="Confirm your new password"
                                            className="max-w-md"
                                        />
                                        <InputError message={errors.password_confirmation} className="mt-1" />
                                    </div>

                                    <div className="flex items-center pt-2">
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Updating...' : 'Update Password'}
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
                                            <div className="ml-4 flex items-center text-sm text-green-600">
                                                <CheckCircle2 className="mr-1.5 h-4 w-4" />
                                                <span>Password updated successfully!</span>
                                            </div>
                                        </Transition>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="border-amber-100 bg-amber-50">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-amber-900">Having trouble?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-amber-800">
                                If you've forgotten your password, you can request a password reset link from the login page.
                            </p>
                            <Button variant="outline" className="mt-4 border-amber-200 text-amber-800 hover:bg-amber-100">
                                Go to Login
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}

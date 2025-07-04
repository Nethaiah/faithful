import { Head, useForm } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff, BookOpen, Heart } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false)
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <Head title="Log in" />

            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className="p-3 rounded-full bg-indigo-100">
                            <BookOpen className="h-8 w-8 text-indigo-600" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to continue your spiritual journey</p>
                </div>

                {/* Status Message */}
                {status && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="text-sm font-medium text-green-800">{status}</div>
                    </div>
                )}

                {/* Login Form */}
                <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="px-6 pt-6 pb-4">
                        <CardTitle className="text-xl font-semibold text-gray-900">Sign In</CardTitle>
                        <CardDescription className="text-gray-600">
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 pt-0">
                        <form onSubmit={submit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="pl-10 h-11 text-base border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                        autoComplete="email"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="pl-10 pr-10 h-11 text-base border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        checked={data.remember}
                                        onCheckedChange={(checked) => setData('remember', checked as boolean)}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <Label htmlFor="remember" className="text-sm text-gray-700">
                                        Remember me
                                    </Label>
                                </div>
                                {canResetPassword && (
                                    <TextLink
                                        href={route('password.request')}
                                        className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
                                    >
                                        Forgot password?
                                    </TextLink>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 text-base font-medium bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 transition-colors"
                                disabled={processing}
                            >
                                {processing ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>

                        <Separator className="my-6" />

                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{" "}
                                <TextLink
                                    href={route('register')}
                                    className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium"
                                >
                                    Create account
                                </TextLink>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-xs text-gray-500">
                        By signing in, you agree to our{" "}
                        <TextLink href="#" className="hover:underline">
                            Terms of Service
                        </TextLink>{" "}
                        and{" "}
                        <TextLink href="#" className="hover:underline">
                            Privacy Policy
                        </TextLink>
                    </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 -z-10 h-full w-full">
                    <div className="absolute top-10 left-10 h-20 w-20 rounded-full bg-blue-100 opacity-20"></div>
                    <div className="absolute top-1/4 right-10 h-16 w-16 rounded-full bg-purple-100 opacity-20"></div>
                    <div className="absolute bottom-20 left-1/4 h-12 w-12 rounded-full bg-indigo-100 opacity-20"></div>
                </div>
            </div>
        </div>
    );
}

import { Head, useForm } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff, User, BookOpen, Heart } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Checkbox } from '@/components/ui/checkbox';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    terms: boolean;
};

export default function Register() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <Head title="Register" />

            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <div className="p-3 rounded-full bg-indigo-100">
                            <Heart className="h-8 w-8 text-indigo-600" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Faithful</h1>
                    <p className="text-gray-600">Start your personalized Bible devotion journey today</p>
                </div>

                {/* Registration Form */}
                <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="px-6 pt-6 pb-4">
                        <CardTitle className="text-xl font-semibold text-gray-900">Create Account</CardTitle>
                        <CardDescription className="text-gray-600">
                            Fill in your details to get started with Faithful
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 pt-0">
                        <form onSubmit={submit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                    Full Name
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Your full name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="pl-10 h-11 text-base border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                        autoComplete="name"
                                    />
                                </div>
                                <InputError message={errors.name} />
                            </div>

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
                                        placeholder="Create a strong password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="pl-10 pr-10 h-11 text-base border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                        autoComplete="new-password"
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

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="pl-10 pr-10 h-11 text-base border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <div className="flex items-start space-x-3">
                                <Checkbox
                                    id="terms"
                                    checked={data.terms}
                                    onCheckedChange={(checked) => setData('terms', checked as boolean)}
                                    className="h-4 w-4 rounded border-gray-300 mt-1"
                                />
                                <Label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                                    I agree to the{" "}
                                    <TextLink href="#" className="text-indigo-600 hover:text-indigo-700 hover:underline">
                                        Terms of Service
                                    </TextLink>{" "}
                                    and{" "}
                                    <TextLink href="#" className="text-indigo-600 hover:text-indigo-700 hover:underline">
                                        Privacy Policy
                                    </TextLink>
                                </Label>
                            </div>
                            <InputError message={errors.terms} />

                            <Button
                                type="submit"
                                className="w-full h-11 text-base font-medium bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 transition-colors"
                                disabled={processing}
                            >
                                {processing ? "Creating account..." : "Create Account"}
                            </Button>
                        </form>

                        <Separator className="my-6" />

                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{" "}
                                <Link
                                    href={route('login')}
                                    className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Features Preview */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="p-1.5 rounded-full bg-blue-100">
                                <BookOpen className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">Personal Devotions</span>
                        </div>
                        <p className="text-xs text-gray-600">Create and manage your spiritual reflections</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="p-1.5 rounded-full bg-purple-100">
                                <Heart className="h-4 w-4 text-purple-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">Mood-Based Verses</span>
                        </div>
                        <p className="text-xs text-gray-600">Find verses that match your current mood</p>
                    </div>
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

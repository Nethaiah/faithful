import { Head, useForm } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
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
        <AuthLayout title="Welcome Back" description="Sign in to continue your spiritual journey">
            <Head title="Log in" />

            {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl'>Sign In</CardTitle>
            <CardDescription>Enter your email and password to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="pl-10"
                  />
                </div>
                <InputError message={errors.email} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                <InputError message={errors.password} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" className="rounded" />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me
                  </Label>
                </div>
                <TextLink href={route('password.request')} className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </TextLink>
              </div>

              <Button type="submit" className="w-full" disabled={processing}>
                {processing ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <Separator className="my-6" />

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <TextLink href={route('register')} className="text-blue-600 hover:underline font-medium">
                  Sign up
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

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}

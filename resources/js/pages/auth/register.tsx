import { Head, useForm } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
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
};

export default function Register() {
    const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Join Faithful" description="Start your personalized Bible devotion journey today">
            <Head title="Register" />
            {/* Registration Form */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="px-4 sm:px-6 pt-6 pb-4 sm:pb-5">
            <CardTitle className='text-xl sm:text-2xl font-semibold text-center sm:text-left'>Create Account</CardTitle>
            <CardDescription className="text-center sm:text-left text-sm sm:text-base">Fill in your details to get started with Faithful</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8 pt-0">
            <form onSubmit={submit} className="space-y-4 sm:space-y-5">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-sm sm:text-base">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                    autoComplete="name"
                  />
                </div>
                <InputError message={errors.name} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                    autoComplete="email"
                  />
                </div>
                <InputError message={errors.email} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className="pl-10 pr-10 h-11 sm:h-12 text-sm sm:text-base"
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    )}
                  </Button>
                </div>
                <InputError message={errors.password} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword" className="text-sm sm:text-base">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    className="pl-10 pr-10 h-11 sm:h-12 text-sm sm:text-base"
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    )}
                  </Button>
                </div>
                <InputError message={errors.password_confirmation} />
              </div>

              <div className="flex items-start gap-2">
                <Checkbox id="terms" className="rounded h-4 w-4 mt-1" required />
                <Label htmlFor="terms" className="text-sm sm:text-base leading-relaxed">
                  I agree to the{" "}
                  <TextLink href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </TextLink>{" "}
                  and{" "}
                  <TextLink href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </TextLink>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium"
                disabled={processing}
              >
                {processing ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <Separator className="my-5 sm:my-6" />

            <div className="text-center">
              <p className="text-sm sm:text-base text-gray-600">
                Already have an account?{" "}
                <Link
                  href={route('login')}
                  className="text-blue-600 hover:underline font-medium whitespace-nowrap"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
        </AuthLayout>
    );
}

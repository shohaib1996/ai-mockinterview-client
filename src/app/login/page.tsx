"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useGoogleLoginMutation, useLoginUserMutation } from "@/redux/api/user/usersApi";
import { useAppDispatch } from "@/redux/hooks/hooks";
import { login, logout } from "@/redux/feature/auth/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import loginImg from "../../../public/login.jpg"
import Image from "next/image";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginUser, { isLoading, isError, error }] = useLoginUserMutation();
  const [googleLogin] = useGoogleLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch(logout());
      const res = await loginUser({ email, password }).unwrap();
      console.log(res.data);
      dispatch(login({ user: res.data.user, token: res.data.accessToken }));
      if (res.data.user.role === "ADMIN") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/user");
      }
    } catch (err) {
      console.error("Failed to login:", err);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      console.error("Google did not return a credential");
      return;
    }
    try {
      const res = await googleLogin({ idToken: credentialResponse.credential }).unwrap();
      dispatch(login({ user: res.data.user, token: res.data.accessToken }));
      if (res.data.user.role === "ADMIN") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/user");
      }
    } catch (err) {
      console.error("Failed to log in with Google:", err);
    }
  };

  const handleQuickLogin = (userType: "user" | "admin") => {
    if (userType === "user") {
      setEmail("john.doe@example.com");
      setPassword("securePass123");
    } else {
      setEmail("john.doe2@example.com");
      setPassword("securePass123");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 items-center justify-center p-12">
        <div className="text-center text-white">
          <div className=" bg-white/10 rounded-2xl flex items-center justify-center mb-8">
            <div className=" bg-white/20 rounded-xl flex items-center justify-center">
              <Image src={loginImg} alt="login image" width={300} height={300} className="object-cover" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-lg opacity-90">
            Sign in to access your account and continue your journey with us.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-white/80 via-white/30 to-black/40 dark:from-[#1D2B64] dark:via-black dark:to-[#06D6A0]">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Sign In
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Quick Login:</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => handleQuickLogin("user")}
                >
                  User Login
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => handleQuickLogin("admin")}
                >
                  Admin Login
                </Button>
              </div>
            </div>

            <Separator />

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.error("Google login failed")}
                theme="outline"
                shape="rectangular"
                text="continue_with"
                width={380}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me
                  </Label>
                </div>
                <Button variant="link" className="px-0 text-sm">
                  Forgot password?
                </Button>
              </div>

              <Button type="submit" className="w-full bg-[#06D6A0]" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {isError && (
              <div className="text-center text-sm text-red-500">
                {/* @ts-expect-error: error typing is too generic */}
                <p>{error?.data?.message || "An error occurred"}</p>
              </div>
            )}

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Don&apos;t have an account?{" "}
              </span>
              <Link href="/register">
                <Button variant="link" className="px-0">
                  Sign up
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

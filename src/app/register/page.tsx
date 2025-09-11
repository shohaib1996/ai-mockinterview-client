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
import { Eye, EyeOff } from "lucide-react";
import { useRegisterUserMutation } from "@/redux/api/user/usersApi";
import { useAppDispatch } from "@/redux/hooks/hooks";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import loginImg from "../../../public/login.jpg"

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registerUser, { isLoading, isError, error }] =
    useRegisterUserMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await registerUser({ name, email, password }).unwrap();
      if (res.success) {
        toast.success("Registration successfully done");
        router.push("/login");
      }
    } catch (err) {
      console.error("Failed to register:", err);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 items-center justify-center p-12">
        <div className="text-center text-white">
          <div className=" bg-white/10 rounded-2xl flex items-center justify-center mb-8">
            <div className=" bg-white/20 rounded-xl flex items-center justify-center">
              <Image
                src={loginImg}
                alt="login image"
                width={300}
                height={300}
                className="object-cover"
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Join Us Today!</h2>
          <p className="text-lg opacity-90">
            Create an account to start your journey with our platform.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-white/80 via-white/30 to-black/40 dark:from-[#1D2B64] dark:via-black dark:to-[#06D6A0]">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Sign Up
            </CardTitle>
            <CardDescription className="text-center">
              Enter your details to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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

              <Button type="submit" className="w-full bg-[#06D6A0]" disabled={isLoading}>
                {isLoading ? "Signing Up..." : "Sign Up"}
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
                Already have an account?{" "}
              </span>
              <Link href="/login">
                <Button variant="link" className="px-0">
                  Sign in
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

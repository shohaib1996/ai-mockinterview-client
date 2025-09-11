"use client"

import { useGetProfileQuery, useResetPasswordMutation, useUpdateProfileMutation } from "@/redux/api/user/usersApi"
import type { ISingleUser, UpdateProfileData, ResetPasswordData } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { UpdateProfileForm } from "@/components/profile/UpdateProfileForm"
import { ResetPasswordForm } from "@/components/profile/ResetPasswordForm"

const ProfilePage = () => {
  const { data, isLoading, error } = useGetProfileQuery({})
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation()

  const profileData: ISingleUser = data?.data

  const handleUpdateProfile = async (updateData: UpdateProfileData) => {
    try {
      await updateProfile(updateData).unwrap()
    } catch (error) {
      throw error
    }
  }

  const handleResetPassword = async (passwordData: ResetPasswordData) => {
    try {
      await resetPassword(passwordData).unwrap()
    } catch (error) {
      throw error
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-10" />
          </div>

          <div className="bg-card rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-br from-[#1D2B64] to-[#04AF82] p-8">
              <div className="flex items-center gap-6">
                <Skeleton className="h-32 w-32 rounded-full" />
                <div className="space-y-3">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to load profile data. Please try again later.</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No profile data available.</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        {/* Header with navigation and theme toggle */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <Button variant="ghost" asChild className="text-[#1D2B64] dark:text-white">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        {/* Main profile card */}
        <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-[#1D2B64]/10">
          {/* Profile header with gradient background */}
          <ProfileHeader user={profileData} />

          {/* Profile content */}
          <div className="p-6 md:p-8 space-y-8">
            {/* Update profile form */}
            <UpdateProfileForm user={profileData} onUpdate={handleUpdateProfile} isLoading={isUpdating} />

            {/* Reset password form */}
            <ResetPasswordForm onResetPassword={handleResetPassword} isLoading={isResetting} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage

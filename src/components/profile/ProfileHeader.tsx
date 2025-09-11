"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ISingleUser } from "@/types"
import { Mail, Calendar, Shield } from "lucide-react"

interface ProfileHeaderProps {
  user: ISingleUser
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="bg-gradient-to-br from-[#1D2B64] to-[#04AF82] p-6 md:p-8 rounded-t-xl text-white">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white/20">
          <AvatarImage src={user?.avatarUrl || "/placeholder.svg"} alt={user?.name} />
          <AvatarFallback className="bg-white/20 text-white text-xl md:text-2xl font-semibold">
            {getInitials(user?.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center sm:text-left space-y-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-balance">{user?.name}</h1>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
              <Mail className="h-4 w-4" />
              <span className="text-white/90">{user.email}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Shield className="h-3 w-3 mr-1" />
              {user.role}
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Calendar className="h-3 w-3 mr-1" />
              Joined {formatDate(user.createdAt)}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}

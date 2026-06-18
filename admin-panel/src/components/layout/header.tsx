/**
 * Dashboard Header
 *
 * Features:
 * - Admin user display
 * - Logout action
 * - Mobile menu toggle
 * - Responsive design
 */

"use client";

import { LogOut, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "AD";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-700 bg-slate-900/95 backdrop-blur px-4 md:px-6">
      {/* Left side - Mobile menu button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-slate-400 hover:text-white"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold text-white hidden md:block">
          Admin Dashboard
        </h2>
      </div>

      {/* Right side - User menu */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="relative flex items-center gap-2 text-slate-300 hover:text-white rounded-md px-3 py-2 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-green-500/10 text-green-400 text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:inline-block text-sm">
              {user?.name || "Admin"}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-slate-800 border-slate-700"
          >
            <DropdownMenuLabel className="text-slate-300">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name || "Admin"}</p>
                <p className="text-xs text-slate-500">
                  {user?.email || "admin@batterydoctor.app"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem className="text-slate-300 focus:text-white focus:bg-slate-700">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem
              onClick={logout}
              className="text-red-400 focus:text-red-300 focus:bg-slate-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

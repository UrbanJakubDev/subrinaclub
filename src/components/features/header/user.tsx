"use client"
import { Avatar, Button, Menu, MenuHandler, MenuItem, MenuList } from '@material-tailwind/react'
import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLogout } from '@/lib/queries/auth/mutations'
import { Settings, LogOut, Key, User as UserIcon } from 'lucide-react'

type Props = {}

export default function User({}: Props) {
  const { user, logout } = useAuth()
  const logoutMutation = useLogout()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    if (!firstName || !lastName) return 'U'
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  const getDisplayName = (user: any) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.email || 'Uživatel';
  }

  const getInitialsFromUser = (user: any) => {
    if (user.firstName && user.lastName) {
      return getInitials(user.firstName, user.lastName);
    }
    // Use first letter of email if no name
    return user.email ? user.email[0].toUpperCase() : 'U';
  }

  const getRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      ADMIN: 'Administrátor',
      SALES_MANAGER: 'Sales Manager',
      CUSTOMER: 'Zákazník',
      GUEST: 'Host',
    }
    return roleLabels[role] || role
  }

  if (!user) {
    return (
      <div className='w-60 text-right'>
        <Button
          variant="text"
          size="sm"
          className="text-blue-600 hover:text-blue-800"
          onClick={() => window.location.href = '/auth'}
        >
          Přihlásit se
        </Button>
      </div>
    )
  }

  return (
    <div className='w-60 text-right'>
      <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
        <MenuHandler>
          <Button
            variant="text"
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div
              className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center text-xs font-medium"
            >
              {getInitialsFromUser(user)}
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-medium text-gray-900">
                {getDisplayName(user)}
              </span>
              <span className="text-xs text-gray-500">
                {getRoleLabel(user.role)}
              </span>
            </div>
          </Button>
        </MenuHandler>
        <MenuList className="w-56">
          <div className="px-3 py-2 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">
              {getDisplayName(user)}
            </p>
            <p className="text-xs text-gray-500">
              {user.email}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {getRoleLabel(user.role)}
            </p>
          </div>
          
          <MenuItem className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            <span>Profil</span>
          </MenuItem>
          
          <MenuItem className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span>Změnit heslo</span>
          </MenuItem>
          
          <MenuItem className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Nastavení</span>
          </MenuItem>
          
          <hr className="my-2 border-gray-200" />
          
          <MenuItem 
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Odhlásit se</span>
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  )
}
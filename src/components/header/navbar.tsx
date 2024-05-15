"use client"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation' 
import React from 'react'

type Props = {}

export default function Nav({ }: Props) {
  const pathName = usePathname()

  const linkArray = [
    { href: '/', label: 'Home' },
    { href: '/users', label: 'Zákazníci' },
    { href: '/dealers', label: 'Obchodníci' },
    { href: '/sales-managers', label: 'Obchodní manažeři' },
    { href: '/reports/bonus', label: 'Reporty' },
  ]


  const NavItem = ({ href, label }) => {
    const isActive = pathName === href; // No need for useState here
    const baseClass = 'text-lg font-semibold text-zinc-700 hover:text-[#8D354E] transition-colors duration-300'
    const activeClass = 'border-b-2 border-[#8D354E]'
    const mergedClass = isActive ? `${baseClass} ${activeClass}` : baseClass


    return (
      <Link className={mergedClass} href={href}>{label}</Link>
    )
  }


  return (
    <div className='flex gap-4'>
      {linkArray.map((link, index) => (
        <NavItem key={index} href={link.href} label={link.label} />
      ))}
    </div>
  )
}
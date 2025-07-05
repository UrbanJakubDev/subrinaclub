'use client'
import React from 'react'
import Logo from './logo'
import User from './user'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCoins,
    faMedal,
    faUser,
    faChevronDown,
    faChartBar,
    faList,
    faBars,
    faTimes,
} from '@fortawesome/free-solid-svg-icons'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'

interface MenuItem {
    title: string
    description: string
    link: string
    icon: IconDefinition
}

interface MenuSection {
    title: string
    items: MenuItem[]
}

const menuItems: MenuSection[] = [
    {
        title: 'Zákazníci',
        items: [
            {
                title: 'Přehled',
                description: 'Základní informace o zákaznících',
                link: '/customers',
                icon: faUser,
            },
            {
                title: 'Šetřící období',
                description: 'Přehled aktivních šetřících období',
                link: '/customers/saving-periods',
                icon: faCoins,
            },
            {
                title: 'Seznam účtů',
                description: 'Seznam aktivních účtů',
                link: '/accounts',
                icon: faList,
            },
        ],
    },
    {
        title: 'Obchodní zástupci',
        items: [
            {
                title: 'Přehled',
                description: 'Základní informace o obchodních zástupcích',
                link: '/sales-managers',
                icon: faUser,
            },
        ],
    },
    {
        title: 'Reporty',
        items: [
            {
                title: 'Premium bonus',
                description: 'Reporty premium bonusů',
                link: '/reports/bonus',
                icon: faChartBar,
            },
            {
                title: 'Seznam obratu',
                description: 'Reporty obratů a transakcí',
                link: '/reports/transactions',
                icon: faChartBar,
            },
        ],
    },
    {
        title: 'Čísleníky',
        items: [
            {
                title: 'Premium Bonusy',
                description: 'Čísleník premium bonusů',
                link: '/dictionaries/bonus',
                icon: faMedal,
            },
            {
                title: 'Obchodníci',
                description: 'Čísleník obchodníků',
                link: '/dictionaries/dealers',
                icon: faUser,
            },
        ],
    },
]

interface DropdownMenuProps {
    title: string
    items: MenuItem[]
}

function DropdownMenu({ title, items }: DropdownMenuProps) {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}>
            <button
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isOpen
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}>
                {title}
                <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`w-3 h-3 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {/* Dropdown Menu */}
            <div
                className={`absolute top-full left-0 z-50 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 transition-all duration-200 ${
                    isOpen
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible -translate-y-2'
                }`}>
                <div className="p-4">
                    <div className="space-y-2">
                        {items.map((item, index) => (
                            <Link
                                key={index}
                                href={item.link}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group">
                                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-200">
                                    <FontAwesomeIcon
                                        icon={item.icon}
                                        className="w-4 h-4 text-gray-600"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                                        {item.title}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {item.description}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export function MegaMenuWithHover() {

    return (
        <div className="w-full bg-gray-100 pt-2">
            <div className="w-full px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Logo />
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        <Link
                            href="/"
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                            Home
                        </Link>
                        {menuItems.map((menu, index) => (
                            <DropdownMenu key={index} title={menu.title} items={menu.items} />
                        ))}
                    </nav>

                    {/* Desktop User */}
                    <div className="hidden md:flex flex-shrink-0">
                        <User />
                    </div>
                </div>
            </div>
        </div>
    )
}

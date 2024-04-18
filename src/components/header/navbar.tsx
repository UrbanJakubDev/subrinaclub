import Link from 'next/link'
import React from 'react'

type Props = {}

export default function Nav({}: Props) {
  return (
    <div>
      <ul className='flex'>
        <li className='mx-4'>
          <Link href='/'>
            Home
          </Link>
        </li>
        <li className='mx-4'>
          <Link href='/users'>
            Users
          </Link>
        </li>
        <li className='mx-4'>
          <Link href='/contact'>
            Contact
          </Link>
        </li>
      </ul>
    </div>
  )
}
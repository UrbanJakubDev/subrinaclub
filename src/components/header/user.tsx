"use client"
import { Avatar } from '@material-tailwind/react'
import React from 'react'

type Props = {}

export default function User({}: Props) {
  return (
    <div className='w-60 text-right'>
      <Avatar src="https://docs.material-tailwind.com/img/face-2.jpg" alt="avatar" variant="rounded" />
    </div>
  )
}
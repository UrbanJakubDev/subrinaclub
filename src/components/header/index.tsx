import React from 'react'
import Logo from './logo'
import Nav from './navbar'
import User from './user'
import  MegaMenuWithHover from './megaMenu'

type Props = {}

export default function NavIndex({}: Props) {
  return (
    <div className='min-w-full mx-auto flex justify-between items-center px-8 bg-white h-16 border-b-black shadow'>
      <Logo />
      <Nav />
      {/* <MegaMenuWithHover /> */}
      <User />
    </div>
  )
}
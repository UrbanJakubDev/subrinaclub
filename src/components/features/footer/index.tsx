import React from 'react'

type Props = {}

export default function FooterIndex({}: Props) {

  // Get version from package.json  
  const packageJson = require('../../../../package.json');
  const version = packageJson.version;

  return (
    <div className='w-screen py-2 text-center text-white bg-gray-900'>Subrina Club - {version} ™</div>
  )
}
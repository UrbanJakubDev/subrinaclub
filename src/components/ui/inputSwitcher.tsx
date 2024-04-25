import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'

type SwitcherProps = {
   label: string
   isChecked: boolean
   setIsChecked: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function InputSwitcher({ label, isChecked, setIsChecked }: SwitcherProps) {
   return (
      <>
         <label className='autoSaverSwitch relative inline-flex cursor-pointer select-none items-center'>
            <input
               type='checkbox'
               name='autoSaver'
               className='sr-only'
               checked={isChecked}
               onChange={setIsChecked}
            />
            <span
               className={`slider mr-3 flex h-[26px] w-[50px] items-center rounded-full p-1 duration-200 ${isChecked ? 'bg-primary' : 'bg-[#CCCCCE]'
                  }`}
            >
               <span
                  className={`dot h-[18px] w-[18px] rounded-full bg-white duration-200 ${isChecked ? 'translate-x-6' : ''
                     }`}
               ></span>
            </span>
            <span className='label flex items-center text-sm font-medium text-black'>
               {label}
            </span>
         </label>
      </>
   )
}
"use client"
import { Chip } from '@material-tailwind/react';
import React from 'react'

type Props = {
   status: boolean | string | unknown;
}

const StatusChip = (props: Props) => {
   return (
      <Chip className='w-fit font-normal' color={props.status ? "green" : "red"} variant='ghost' size="sm" value={props.status ? "Aktivní" : "Neaktivní"} />
   )
}

export default StatusChip
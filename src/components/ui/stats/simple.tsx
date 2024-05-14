import React from 'react'

type Props = {
   label : string
   value : number
}

const SimpleStat = (props: Props) => {
  return (
    <div className="flex flex-col items-center border shadow-md p-8 my-2">
      <p className="text-4xl font-bold text-gray-900 shadow-inherit">{props.value}</p>
      <p className="text-sm text-gray-500">{props.label}</p>
    </div>
  )
}

export default SimpleStat
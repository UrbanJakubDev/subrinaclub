// 'use client'
// import StatusChip from '../tables/ui/statusChip'
// import StatusIcon from '../tables/ui/statusIcon'
// import { useState } from 'react'
// type ServerStatusProps = {
//     systemStatus: boolean
//     lastUpdated: string
//     id: number
// }

// export default function ServerStatus({ systemStatus, lastUpdated, id }: ServerStatusProps) {
//     return (
//         <div className="relative">
//             <div className="flex items-center  rounded-sm p-1 gap-1">
//                 <StatusIcon active={Boolean(systemStatus)} />
//                 <span className="text-sm text-gray-500 text-nowrap">ID - {id}</span>
//                 <span className="text-xs text-gray-500 text-right w-full">
//                     aktualizováno {lastUpdated}
//                 </span>
//             </div>
//         </div>
//     )
// }

'use client'
import { useState, useEffect } from 'react'
import { HiCheckCircle, HiXCircle } from 'react-icons/hi' // Například ikony pro aktivní a neaktivní stav

type ServerStatusProps = {
    systemStatus: boolean
    lastUpdated: string
    id: number
}

export default function ServerStatus({ systemStatus, lastUpdated, id }: ServerStatusProps) {
    const [isStale, setIsStale] = useState(false)

    useEffect(() => {
        const lastUpdateTime = new Date(lastUpdated).getTime()
        const currentTime = Date.now()
        const timeDiff = currentTime - lastUpdateTime

        // Pokud je rozdíl větší než 5 minut (300000 ms), označujeme data za "stará"
        if (timeDiff > 300000) {
            setIsStale(true)
        }
    }, [lastUpdated])

    // Dynamická ikona podle stavu a stáří dat
    const statusIcon = systemStatus
        ? isStale
            ? <HiXCircle className="text-red-500" title="Data stará více než 5 minut" />
            : <HiCheckCircle className="text-green-500" title="Systém je aktivní" />
        : <HiXCircle className="text-gray-500" title="Systém je neaktivní" />

    return (
        <div className="relative">
            <div className="flex items-center gap-2">
                {statusIcon}
                <span className="text-xs text-gray-500" title={`ID: ${id} | Aktualizováno: ${lastUpdated}`}>
                    ID - {id}
                </span>
            </div>
        </div>
    )
}

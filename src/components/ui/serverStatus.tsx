'use client'
import StatusChip from "../tables/ui/statusChip";
import StatusIcon from "../tables/ui/statusIcon";
import { useState } from "react";
type ServerStatusProps = {
   systemStatus: boolean;
   lastUpdated: string;
   id: number;
}

export default function ServerStatus({ systemStatus, lastUpdated, id }: ServerStatusProps) {
   return (
      <div className="relative">
         <div className="flex items-center  rounded-sm p-1 gap-1" >
            <StatusIcon active={Boolean(systemStatus)} />
            <span className="text-sm text-gray-500 text-nowrap">ID - {id}</span>
            <span className="text-xs text-gray-500 text-right w-full">aktualizováno {lastUpdated}</span>
         </div>
    
      </div>
   );
}
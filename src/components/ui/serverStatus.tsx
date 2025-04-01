import StatusChip from "../tables/ui/statusChip";
import StatusIcon from "../tables/ui/statusIcon";

type ServerStatusProps = {
   systemStatus: boolean;
   lastUpdated: string;
   id: number;
}

export default function ServerStatus({ systemStatus, lastUpdated, id }: ServerStatusProps) {

   return (
    <div className="flex flex-col gap-2 items-start">
    <div className="flex gap-2 items-center">
       <span className="text-sm text-gray-500"></span><StatusIcon active={Boolean(systemStatus)} /><span className="text-sm text-gray-500">ID -{id}</span>
    </div>
    <div className="text-xs text-gray-500">last updated {lastUpdated}</div>
 </div>
   );
}
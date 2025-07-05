import { faChartSimple, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

type Props = {
   id?: string;
   detailLinkPath?: string;
   hasStats?: boolean;
   deleteAction?: (id: string) => void;
};

const ActionButtons = ({ id, detailLinkPath = "", hasStats, deleteAction }: Props) => (
   <div className="flex gap-1 justify-end">
      {/* Detail button (conditionally rendered if `id` is passed) */}
      <Link href={`${detailLinkPath}/${id}`} className="text-center">
         <div className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200" title="Upravit">
            <FontAwesomeIcon icon={faPenToSquare} className="w-4 h-4" />
         </div>
      </Link>

      {hasStats && id && (
         <Link href={`${detailLinkPath}/${id}/stats`} className="text-center">
            <div className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200" title="Statistiky">
               <FontAwesomeIcon icon={faChartSimple} className="w-4 h-4" />
            </div>
         </Link>
      )}

      {/* Delete button (conditionally rendered if `deleteAction` is passed) */}
      {deleteAction && id && (
          <div 
             onClick={() => deleteAction(id)} 
             className="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200 cursor-pointer"
             title="Smazat"
          >
            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
         </div>
      )}
   </div>
);

export default ActionButtons;

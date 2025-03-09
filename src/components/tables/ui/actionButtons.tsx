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
   <div className="flex gap-2 justify-end">
      {/* Detail button (conditionally rendered if `id` is passed) */}
      <Link href={`${detailLinkPath}/${id}`} className="text-center">
         <div className="w-9 h-9 text-gray-400 flex justify-center items-center hover:bg-gray-500 hover:rounded-md transition-all duration-200">
            <FontAwesomeIcon icon={faPenToSquare} />
         </div>
      </Link>

      {hasStats && id && (
         <Link href={`${detailLinkPath}/${id}/stats`} className="text-center">
            <div className="w-9 h-9 text-gray-400 flex justify-center items-center hover:bg-gray-500 hover:rounded-md transition-all duration-200">
               <FontAwesomeIcon icon={faChartSimple} />
            </div>
         </Link>
      )}

      {/* Delete button (conditionally rendered if `deleteAction` is passed) */}
      {deleteAction && id && (
          <div onClick={() => deleteAction} className="w-9 h-9 text-red-600 flex justify-center items-center hover:bg-gray-500 hover:rounded-md transition-all duration-200">
            <FontAwesomeIcon icon={faTrash} />
         </div>
      )}
   </div>
);

export default ActionButtons;

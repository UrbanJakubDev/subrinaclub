import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Separate components for better organization
const StatusIcon = ({ active }: { active: boolean }) => (
   <div className="text-center">
      <FontAwesomeIcon
         icon={active ? faCheck : faXmark}
         style={{ color: active ? "#00ff00" : "#ff0000", scale: 1.4 }}
      />
   </div>
);

export default StatusIcon;
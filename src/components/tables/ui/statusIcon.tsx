import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Separate components for better organization
const StatusIcon = ({ active }: { active: boolean }) => (
   <FontAwesomeIcon
      icon={active ? faCheck : faXmark}
      style={{ color: active ? "#00ff00" : "#ff0000" }}
   />
);

export default StatusIcon;
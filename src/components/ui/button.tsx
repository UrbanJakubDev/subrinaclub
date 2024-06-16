type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success" | "warning" | "info";
  onClick?: () => void;
  className?: string;
};

export default function Button({
  children,
  variant = "primary",
  onClick,
  className,
}: ButtonProps) {
  let baseCls = "text-white font-bold py-2 px-4 rounded drop-shadow-md hover:drop-shadow-lg";

  switch (variant) {
    case "primary":
      baseCls += " bg-[#8D354E] hover:bg-[#6F2738]";
      break;
    case "secondary":
      baseCls += " bg-gray-500 hover:bg-gray-700";
      break;
    case "danger":
      baseCls += " bg-red-500 hover:bg-red-700";
      break;
    case "success":
      baseCls += " bg-green-500 hover:bg-green-700";
      break;
    case "warning":
      baseCls += " bg-yellow-500 hover:bg-yellow-700";
      break;
    case "info":
      baseCls += " bg-indigo-500 hover:bg-indigo-700";
      break;
  }

  let mergedCls = baseCls + " " + className;

  return (
    <button onClick={onClick} className={mergedCls}>
      {children}
    </button>
  );
}

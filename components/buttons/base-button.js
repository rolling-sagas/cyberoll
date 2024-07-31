export default function BaseButton({
  label,
  className,
  onClick,
  disabled = false,
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`bg-rs-backgroud-2 p-1 h-9 flex items-center justify-center
        border-[1px] border-rs-border disabled:text-rs-text-secondary 
        rounded-[10px] ${className || ""}`}
    >
      <div className="px-4 font-semibold ">{label}</div>
    </button>
  );
}

import { Button } from "@/app/components/ui/button";
import './button.css';
import { formatNumber } from "@/utils/utils";

export default function HoverButton({ children, count = 0, onClick = () => {}, className = '' }) {

  return (
    <Button
      asChild
      variant="ghost"
      onClick={onClick}
      className={`group flex justify-center items-center relative hover:bg-transparent min-w-9 hover-button ${count ? 'px-3 -mx-[3px]' : 'px-[9px]'} ${className}`}
    >
      <div>
        <div
          className={`transition absolute rounded-[18px] ease
              w-full h-full z-[0]
              group-hover:bg-rs-background-hover scale-0 duration-100 
              group-hover:scale-100`}
        />
        <div
          className="relative z-[1] flex items-center justify-center
            text-rs-text-tertiary"
        >
          {children}{count ? <span className="ml-1">{formatNumber(count)}</span> : null}
        </div>
      </div>
    </Button>
  );
}

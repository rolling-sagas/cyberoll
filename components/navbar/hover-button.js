export default function HoverButton({ children, className = '' }) {
  return (
    <div
      className={
        'group sm:w-[60px] w-10 sm:h-[60px] h-10 flex justify-center items-center relative ' +
        className
      }
    >
      <div
        className="group-hover:scale-110          
        transition duration-200 h-6 w-6 z-[1] 
        text-rs-text-secondary group-data-[active]:text-rs-text-primary"
      >
        {children}
      </div>
      <div
        className="transition absolute w-full h-full rounded-lg
          top-0 left-0 bg-neutral-200/0 scale-50 duration-200 
          group-hover:scale-100 
          group-hover:bg-rs-background-hover"
      />
    </div>
  );
}

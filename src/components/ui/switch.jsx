import * as React from "react";

const Switch = React.forwardRef(({ checked, onCheckedChange, ...props }, ref) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      ref={ref}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${checked ? 'bg-indigo-600' : 'bg-gray-200'}`}
      {...props}
    >
      <span className="sr-only">Toggle theme</span>
      <span
        data-state={checked ? "checked" : "unchecked"}
        className={`pointer-events-none block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  );
});

Switch.displayName = "Switch";

export { Switch };
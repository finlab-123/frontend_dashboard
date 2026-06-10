import * as React from "react";

const mobile _BREAKPOINT = 768;

export function useIsmobile() {
  const [ismobile, setIsmobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${mobile _BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsmobile (window.innerWidth < mobile _BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsmobile (window.innerWidth < mobile _BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!ismobile ;
}


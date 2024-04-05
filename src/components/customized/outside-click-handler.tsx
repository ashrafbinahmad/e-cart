import { ReactNode, useRef } from "react";

import { useOnClickOutside } from "usehooks-ts";

export default function OutsideClickHandler({ children }: { children: ReactNode }) {
  const ref = useRef(null);

  const handleClickOutside = () => {
  };

  const handleClickInside = () => {
  };

  useOnClickOutside(ref, handleClickOutside);

  return (
    <div ref={ref} onClick={handleClickInside}>
      {children}
    </div>
  );
}

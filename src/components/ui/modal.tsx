"use client";

import { type ElementRef, useEffect, useRef, LegacyRef } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { DialogClose } from "./dialog";
import { PanelTopClose } from "lucide-react";
import OutsideClickHandler from "../customized/outside-click-handler";
// import { createPortal } from "react-dom";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dialogRef = useRef<ElementRef<"dialog">>(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  function onDismiss() {
    router.back();
  }

  return createPortal(
    <OutsideClickHandler>
      <div className="modal-backdrop " onClick={onDismiss}>
        <dialog
          ref={dialogRef}
          // ref={ref}
          className="modal p-5 rounded-sm w-full sm:w-96 "
          onClose={onDismiss}
          onClick={function (event) {
            event.stopPropagation();
          }}
        >
          <button
            onClick={onDismiss}
            className="ml-auto mr-0 cursor-pointer"
          ></button>
          {children}
        </dialog>
      </div>
    </OutsideClickHandler>,
    document.getElementById("modal-root")!
  );
}

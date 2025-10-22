"use client"

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type ModalProps = {
  isOpen: boolean;
  blur?: boolean;
  className?: string;
  children: ReactNode;
  onClose?: () => void;
};

function Modal({ isOpen, blur = true, className, children, onClose }: ModalProps) {
  if (!isOpen) return null;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 flex justify-center items-center z-50",
        blur && "bg-black/20 backdrop-blur-[2px]"
      )}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={cn("max-w-4/5 max-h-4/5 overflow-hidden flex justify-center p-4 py-8 z-[100] bg-white rounded-lg", className)} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}

export default Modal;

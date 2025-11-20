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

function Modal({ isOpen, className, children, onClose }: ModalProps) {

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

  if (!isOpen) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 flex justify-center items-center z-50 bg-black/40 transition-all",
        isOpen ? "opacity-100 scale-100" : "opacity-0 bg-transparent scale-75",
      )}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={cn("max-h-[98vh] md:max-w-[80vw] md:max-h-[93vh] overflow-hidden flex justify-center p-2 md:p-4 py-2 md:py-8 z-[100] bg-white rounded-lg", className)} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}

export default Modal;

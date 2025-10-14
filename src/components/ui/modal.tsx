"use client"

import { ReactNode } from "react";
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

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 flex justify-center items-center z-50 ",
        blur && "bg-black/20 backdrop-blur-[2px]"
      )}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={cn("w-fit flex justify-center p-4 z-[100] bg-white rounded-lg", className)} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}

export default Modal;

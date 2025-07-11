import { cn } from "@/lib/utils";
import { Patrick_Hand } from "next/font/google";

const patrick = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function Pedido({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-between w-[150px] h-[120px] bg-yellow-400 rounded-[4px] shadow-lg cut-br px-2 box-border",
        patrick.className,
        className
      )}
    >
      <p className="text-end">12:49</p>
      <p className="text-center">Pedido 1</p>
      <div className="flex justify-between">
        <p className="text-start text-sm">R$32,90</p>
        <p className="text-start text-sm mr-5">Caixa 01</p>
      </div>
      <div className="absolute bottom-0 right-0 bg-orange-400 w-6 h-5"></div>
    </div>
  );
}

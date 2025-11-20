import { cn } from "@/lib/utils"

function Loading({ className }: { className?: string }) {
   return (<div className={cn("w-6 h-6 border-4 border-[#EA580C] border-t-transparent rounded-full animate-spin", className)}></div>)
}

export default Loading
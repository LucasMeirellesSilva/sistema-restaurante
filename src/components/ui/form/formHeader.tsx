import { LucideIcon } from "lucide-react";

type FormHeaderProps = {
  icon: LucideIcon;
  children: React.ReactNode;
};

function FormHeader({ icon: Icon, children }: FormHeaderProps) {
  return (
    <div className="flex items-center gap-2 border-b w-fit px-4 mx-auto">
      <h2 className="font-medium text-lg">{children}</h2>
      <Icon className="text-neutral-500" />
    </div>
  );
}

export default FormHeader;

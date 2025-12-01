import { ChangeEvent, useId } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";

interface InputStartIconProps {
  icon: string;
  label?: string;
  placeholder?: string;
  inputClass?: string;
  onChange?: (value: string) => void;
}

const InputStartIcon = ({
  icon,
  label,
  placeholder = "",
  inputClass = "",
  onChange,
}: InputStartIconProps) => {
  const id = useId();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className="w-full max-w-xs space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
          <Icon icon={icon} className="w-5 h-5" />
          <span className="sr-only">User</span>
        </div>
        <Input
          id={id}
          type="text"
          placeholder={placeholder}
          className={`peer pl-9 ${inputClass}`}
          onChange={(e) => handleChange(e)}
        />
      </div>
    </div>
  );
};

export default InputStartIcon;

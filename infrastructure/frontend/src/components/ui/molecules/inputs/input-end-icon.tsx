import { ChangeEvent, forwardRef, useId } from "react";

import { Input } from "@/components/ui/atoms/input";
import { Label } from "@/components/ui/atoms/label";
import { Icon } from "@iconify/react";
import { Spinner } from "../../atoms/spinner";

interface InputEndIconProps {
  iconActive: boolean;
  label?: string;
  placeholder?: string;
  inputClass?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  name?: string;
  isLoading?: boolean;
  submitDisabled?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const InputEndIcon = forwardRef<HTMLInputElement, InputEndIconProps>(
  (
    {
      iconActive,
      label,
      placeholder = "",
      inputClass = "",
      onChange,
      value,
      onBlur,
      name,
      isLoading,
      submitDisabled,
      onKeyDown,
    },
    ref
  ) => {
    const id = useId();

    return (
      <div className="w-full space-y-2">
        {label && <Label htmlFor={id}>{label}</Label>}
        <div className="relative">
          <Input
            ref={ref}
            id={id}
            type="text"
            placeholder={placeholder}
            className={`peer pr-9 w-full ${inputClass}`}
            onChange={onChange}
            onKeyDown={onKeyDown}
            value={value}
            onBlur={onBlur}
            name={name}
          />
          <button
            type="submit"
            disabled={submitDisabled}
            className="text-muted-foreground absolute inset-y-0 right-0 flex items-center justify-center px-3 peer-disabled:opacity-50"
          >
            {isLoading ? (
              <Spinner />
            ) : (
              <Icon
                icon="bi:arrow-right"
                width="16"
                height="16"
                style={{
                  color: iconActive ? "#000" : "#666",
                  cursor: submitDisabled ? "not-allowed" : "pointer",
                }}
              />
            )}
            <span className="sr-only">Next</span>
          </button>
        </div>
      </div>
    );
  }
);

InputEndIcon.displayName = "InputEndIcon";

export { InputEndIcon };
export default InputEndIcon;

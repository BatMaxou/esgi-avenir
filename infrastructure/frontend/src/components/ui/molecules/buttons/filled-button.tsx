interface FilledButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
  icon?: string;
  iconPosition?: "start" | "end";
  iconSize?: number;
  className?: string;
}

import { Button } from "@/components/ui/atoms/button";
import { Spinner } from "@/components/ui/atoms/spinner";
import { Icon } from "@iconify/react";

export function FilledButton({
  label,
  onClick,
  disabled,
  loading,
  type,
  icon,
  iconPosition = "end",
  iconSize = 20,
  className,
}: FilledButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      style={{
        cursor: "pointer",
        backgroundColor: "#e7000b",
        position: "relative",
      }}
      className={`flex items-center gap-2 ${className || ""}`}
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          {icon && iconPosition === "start" && (
            <Icon icon={icon} width={iconSize} height={iconSize} />
          )}
          {label}
          {icon && iconPosition === "end" && (
            <Icon icon={icon} width={iconSize} height={iconSize} />
          )}
        </>
      )}
    </Button>
  );
}

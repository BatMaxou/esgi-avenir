interface FilledButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
}

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function FilledButton({
  label,
  onClick,
  disabled,
  loading,
  type,
}: FilledButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      style={{ cursor: "pointer" }}
    >
      {loading ? <Spinner /> : label}
    </Button>
  );
}

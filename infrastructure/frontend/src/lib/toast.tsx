import { toast } from "sonner";

interface CustomToastOptions {
  duration?: number | 4000;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const showSuccessToast = (
  message: string,
  options?: CustomToastOptions
) => {
  toast.success(message, {
    description: options?.description,
    duration: options?.duration,
    action: options?.action,
    style: {
      "--normal-bg":
        "color-mix(in oklab, hsl(142 76% 36%) 15%, var(--background))",
      "--normal-text": "hsl(142 76% 36%)",
      "--normal-border": "hsl(142 76% 36%)",
    } as React.CSSProperties,
  });
};

export const showErrorToast = (
  message: string,
  options?: CustomToastOptions
) => {
  toast.error(message, {
    description: options?.description,
    duration: options?.duration,
    action: options?.action,
    style: {
      "--normal-bg":
        "color-mix(in oklab, var(--destructive) 10%, var(--background))",
      "--normal-text": "var(--destructive)",
      "--normal-border": "var(--destructive)",
    } as React.CSSProperties,
  });
};

export const showWarningToast = (
  message: string,
  options?: CustomToastOptions
) => {
  toast.warning(message, {
    description: options?.description,
    duration: options?.duration,
    action: options?.action,
    style: {
      "--normal-bg":
        "color-mix(in oklab, hsl(38 92% 50%) 15%, var(--background))",
      "--normal-text": "hsl(38 92% 50%)",
      "--normal-border": "hsl(38 92% 50%)",
    } as React.CSSProperties,
  });
};

export const showInfoToast = (
  message: string,
  options?: CustomToastOptions
) => {
  toast.info(message, {
    description: options?.description,
    duration: options?.duration,
    action: options?.action,
    style: {
      "--normal-bg":
        "color-mix(in oklab, hsl(221 83% 53%) 15%, var(--background))",
      "--normal-text": "hsl(221 83% 53%)",
      "--normal-border": "hsl(221 83% 53%)",
    } as React.CSSProperties,
  });
};

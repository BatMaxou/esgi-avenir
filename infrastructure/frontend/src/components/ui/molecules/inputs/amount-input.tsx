"use client";

import { ChangeEvent, useState } from "react";
import { Input } from "../../input";

type AmountInputProps = Omit<React.ComponentProps<typeof Input>, "onChange"> & {
  currency?: string;
  displayType?: "form" | "unique";
  onChange?: (value: string) => void;
};

export function AmountInput({
  currency = "€",
  displayType = "form",
  onChange,
  ...props
}: AmountInputProps) {
  const [isFilled, setIsFilled] = useState(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setIsFilled(false);
    } else {
      setIsFilled(true);
    }
    onChange?.(e.target.value);
  };

  const parentDivClasses =
    displayType === "unique" ? "!w-[200px] !border-b" : "!w-full";
  const inputClasses =
    displayType === "unique"
      ? `!bg-none !transition-bg !hover:bg-gray-50 !focus:bg-gray-50 !text-3xl !w-full !h-auto !font-bold !pb-2 !pt-4 !border-0 !pb-4 ${
          isFilled && "pl-12"
        }`
      : "!w-full";

  return (
    <div className={`relative ${parentDivClasses}`}>
      <span
        className={`absolute left-3 top-1/2 -translate-y-1/2 text-3xl text-gray-500 font-bold pointer-events-none ${
          isFilled ? "opacity-100" : "opacity-0"
        }`}
      >
        {currency}
      </span>
      <Input
        type="number"
        inputMode="numeric"
        min="0"
        className={inputClasses}
        placeholder="€"
        onChange={handleChange}
        {...props}
      />
    </div>
  );
}

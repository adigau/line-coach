import clsx from "clsx";
import { ComponentProps, forwardRef } from "react";
import styles from "./TextArea2.module.css";

export const TextArea2 = forwardRef<HTMLTextAreaElement, ComponentProps<"textarea">>(
  ({ className, defaultValue, onChange, disabled, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={clsx(className, styles.textarea)}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={disabled}
      />
    );
  }
);
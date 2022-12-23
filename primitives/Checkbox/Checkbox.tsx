import clsx from "clsx";
import {
  ChangeEvent,
  ComponentProps,
  useCallback,
  useEffect,
  useState,
} from "react";
import { CheckIcon } from "../../icons";
import styles from "./Checkbox.module.css";

interface Props extends ComponentProps<"div"> {
  initialValue: boolean;
  onValueChange?: (value: boolean, id?: string) => void;
  checked: boolean;
  name?: string;
  value: string;
  disabled?: boolean;
  label?: string;
}

export function Checkbox({
  initialValue = false,
  onValueChange = () => { },
  checked = false,
  name,
  disabled = false,
  id,
  value,
  label,
  className,
  ...props
}: Props) {
  const [internalChecked, setInternalChecked] = useState(initialValue);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setInternalChecked(event.target.checked);
      onValueChange(event.target.checked, value);
    },
    [value, onValueChange]
  );

  useEffect(() => {
    setInternalChecked(checked);
  }, [checked]);

  return (
    <div title={label} className={clsx(className, styles.container)} {...props}>
      <input
        className={styles.input}
        type="checkbox"
        name={name}
        id={id}
        checked={internalChecked}
        onChange={handleChange}
        disabled={disabled}
      />
      <span className={styles.checkbox}>
        <CheckIcon className={styles.checkboxIcon} />
      </span>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

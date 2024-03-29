import type React from "react";
import { webpack } from "replugged";

interface SearchBarProps extends Omit<React.ComponentPropsWithoutRef<"div">, "onChange"> {
  autoComplete?: boolean;
  disabled?: boolean;
  hideSearchIcon?: boolean;
  iconClassName?: string;
  inputProps?: React.ComponentPropsWithoutRef<"input">;
  isLoading?: boolean;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onChange?: (value: string) => void;
  onClear?: React.MouseEventHandler<HTMLDivElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onKeyPress?: React.KeyboardEventHandler<HTMLInputElement>;
  onKeyUp?: React.KeyboardEventHandler<HTMLInputElement>;
  query?: string;
  size?: string;
}

export type SearchBarType = React.FC<React.PropsWithChildren<SearchBarProps>> & {
  defaultProps: SearchBarProps;
  Sizes: Record<"SMALL" | "MEDIUM" | "LARGE", string>;
};

export default await webpack.waitForModule<SearchBarType>(
  webpack.filters.bySource(/inputProps:\w+,hideSearchIcon/),
);

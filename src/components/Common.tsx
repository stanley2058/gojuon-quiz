import { ComponentProps, ReactNode } from "react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";

export function TitleText({ children }: { children?: ReactNode }) {
  return <span className="text-sm font-medium">{children}</span>;
}

export function CheckboxButton({
  id,
  children,
  ...rest
}: {
  id: string;
  children?: ReactNode;
} & Omit<ComponentProps<typeof Checkbox>, "id" | "children">) {
  return (
    <Label htmlFor={id} className="cursor-pointer">
      <Badge variant="secondary" className="px-3 py-1.5 gap-2">
        <Checkbox id={id} name={id} {...rest} />
        <span>{children}</span>
      </Badge>
    </Label>
  );
}

export function Divider() {
  return (
    <div
      aria-hidden="true"
      className="border-border border-t-1 border-solid w-full"
    />
  );
}

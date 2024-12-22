import { JSX } from "@arhnage/shaper";

export const Tools: JSX.FC<JSX.ChildrenProps> = ({ children }) => {
  return (
    <header class="flex items-center justify-end h-16 p-3">
      {children}
    </header>
  );
};

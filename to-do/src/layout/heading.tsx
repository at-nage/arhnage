import { JSX } from "@arhnage/shaper";

export const Heading: JSX.FC<JSX.ChildrenProps> = ({ children }) => {
  return (
    <h1 class="px-14 py-3">
      {children}
    </h1>
  );
};

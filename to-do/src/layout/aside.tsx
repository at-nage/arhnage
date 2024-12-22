import { JSX } from "@arhnage/shaper";

export const Aside: JSX.FC<JSX.ChildrenProps> = ({ children }) => {
  return (
    <aside class="shrink-0 w-72 bg-[rgb(252,250,248)] ">
      {children}
    </aside>
  );
};

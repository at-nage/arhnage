import { JSX } from "@arhnage/shaper";

export const Content: JSX.FC<JSX.ChildrenProps> = ({ children }) => {
  return (
    <div class="flex flex-col px-14">
        {children}
    </div>
  );
};

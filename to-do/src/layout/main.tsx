import { JSX } from "@arhnage/shaper";

export const Main: JSX.FC = ({ children }) => {
  return (
    <main class="grow">
      {children}
    </main>
  );
};

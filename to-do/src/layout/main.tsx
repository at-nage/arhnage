import { JSX } from "@arhnage/shaper";

export const Main: JSX.FC = ({ children }) => {
  return (
    <main class="class name" data-attribute="attribute">
      {children}
    </main>
  );
};

declare module 'react-katex' {
  import type { ComponentType, ReactNode } from 'react';

  interface MathComponentProps {
    math: string;
    children?: ReactNode;
    errorColor?: string;
    renderError?: (error: Error) => ReactNode;
  }

  export const InlineMath: ComponentType<MathComponentProps>;
  export const BlockMath: ComponentType<MathComponentProps>;
}

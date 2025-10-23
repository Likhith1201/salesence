/**
 * AutoTranslateText Component
 * Automatically translates text content when language is Turkish
 * Usage: <AutoTranslateText>Your English Text</AutoTranslateText>
 */

import { useAutoTranslate } from "@/hooks/useAutoTranslate";

interface AutoTranslateTextProps {
  children: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  [key: string]: any;
}

export const AutoTranslateText = ({
  children,
  className = "",
  as: Component = "span",
  ...props
}: AutoTranslateTextProps) => {
  const { text, isTranslating } = useAutoTranslate(children);

  return (
    <Component className={className} {...props}>
      {isTranslating ? children : text}
    </Component>
  );
};

// Convenience components for common HTML elements
export const AutoH1 = ({ children, ...props }: Omit<AutoTranslateTextProps, 'as'>) => (
  <AutoTranslateText as="h1" {...props}>{children}</AutoTranslateText>
);

export const AutoH2 = ({ children, ...props }: Omit<AutoTranslateTextProps, 'as'>) => (
  <AutoTranslateText as="h2" {...props}>{children}</AutoTranslateText>
);

export const AutoH3 = ({ children, ...props }: Omit<AutoTranslateTextProps, 'as'>) => (
  <AutoTranslateText as="h3" {...props}>{children}</AutoTranslateText>
);

export const AutoP = ({ children, ...props }: Omit<AutoTranslateTextProps, 'as'>) => (
  <AutoTranslateText as="p" {...props}>{children}</AutoTranslateText>
);

export const AutoSpan = ({ children, ...props }: Omit<AutoTranslateTextProps, 'as'>) => (
  <AutoTranslateText as="span" {...props}>{children}</AutoTranslateText>
);

export const AutoDiv = ({ children, ...props }: Omit<AutoTranslateTextProps, 'as'>) => (
  <AutoTranslateText as="div" {...props}>{children}</AutoTranslateText>
);

export default AutoTranslateText;

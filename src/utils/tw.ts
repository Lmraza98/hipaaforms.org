export interface StyleProps {
  alignment?: 'left' | 'center' | 'right';
  fontSize?:
    | 'xs'
    | 'sm'
    | 'base'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl';
  fontWeight?:
    | 'thin'
    | 'extralight'
    | 'light'
    | 'normal'
    | 'medium'
    | 'semibold'
    | 'bold'
    | 'extrabold'
    | 'black';
  textColor?: string; // tailwind token **or** hex
  margin?: string; // tailwind token (e.g. my-2, mt-4)
  padding?: string; // tailwind token (e.g. p-4, py-2)
}

/**
 * Translates design-time style props (alignment, font size, etc.) to
 * Tailwind utility classes + optional inline styles.
 *
 * Usage:
 *   const { className, style } = stylePropsToTw(fieldDef);
 *   return <h2 className={className} style={style}>Hello</h2>
 */
export function stylePropsToTw({
  alignment,
  fontSize,
  fontWeight,
  textColor,
  margin,
  padding,
}: StyleProps) {
  const isHex = textColor?.startsWith('#');

  const className = [
    alignment && `text-${alignment}`,
    fontSize && `text-${fontSize}`,
    fontWeight && `font-${fontWeight}`,
    !isHex && textColor && `text-${textColor}`,
    margin,
    padding,
  ]
    .filter(Boolean)
    .join(' ');

  const style = isHex ? { color: textColor } : undefined;

  return {
    className,
    style,
  } as const;
} 
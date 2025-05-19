import { useRef, useEffect, useCallback } from 'react';

/**
 * Small helper hook that encapsulates the common contentEditable plumbing for
 * inline-editing text nodes (headings, paragraphs, etc.).
 *
 * Pass the *current* text value and a callback that should run whenever the
 * user is done editing (onBlur). The hook keeps the DOM in sync if the text
 * changes externally.
 *
 * Example:
 *   const { ref, handleBlur } = useEditableText(label, (newText) => save(newText));
 *   return <h2 ref={ref} onBlur={handleBlur} contentEditable />;
 */
export function useEditableText<T extends HTMLElement = HTMLElement>(
  text: string,
  onSave: (newText: string) => void,
) {
  const ref = useRef<T>(null);

  // Keep DOM textContent in sync with external state changes.
  useEffect(() => {
    if (ref.current && ref.current.textContent !== text) {
      ref.current.textContent = text;
    }
  }, [text]);

  const handleBlur = useCallback(() => {
    const newText = ref.current?.textContent ?? '';
    onSave(newText);
  }, [onSave]);

  return { ref, handleBlur } as const;
} 
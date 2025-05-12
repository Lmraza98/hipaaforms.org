export function getContainerClasses({
  isSystem,
  isSelected,
  isPreviewMode = false,
  showOutline = false,
}: {
  isSystem: boolean;
  isSelected: boolean;
  isPreviewMode?: boolean;
  showOutline?: boolean;
}) {
  const base = 'cursor-default rounded-lg transition';
  if (!isSystem && !isPreviewMode) base.replace('cursor-default','cursor-pointer');
  return [
    base,
    isSelected && 'ring-2 ring-blue-500',
    showOutline && 'ring-2 ring-blue-500',
  ].filter(Boolean).join(' ');
} 
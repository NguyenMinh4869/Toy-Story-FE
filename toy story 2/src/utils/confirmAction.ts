export const confirmAction = async (
  message: string,
  onConfirmed?: () => Promise<void>
): Promise<boolean> => {
  const confirmed = window.confirm(message);
  if (confirmed && onConfirmed) await onConfirmed();
  return confirmed;
};

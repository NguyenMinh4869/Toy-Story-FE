export const confirmAction = async <T>(
  message: string,
  action: () => Promise<T> | T
): Promise<T | null> => {
  if (!window.confirm(message)) return null
  return await action()
}

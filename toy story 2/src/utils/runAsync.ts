export const runAsync = async <T>(
  action: () => Promise<T>,
  onError: (message: string) => void,
  errorMessage: string
): Promise<T | null> => {
  try {
    return await action()
  } catch (err) {
    console.error(err)
    onError(errorMessage)
    return null
  }
}

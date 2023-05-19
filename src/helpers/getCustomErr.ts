type ErrType = {
  statusCode?: number,
  error?: string,
  message: string,
}

export default (data: ErrType) => {
  const { statusCode = 401, message, error = 'Unauthorized' } = data

  return { statusCode, message, error }
}

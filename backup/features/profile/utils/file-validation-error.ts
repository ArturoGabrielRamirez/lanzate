export class FileValidationError extends Error {
  public readonly canBeCropped: boolean

  constructor(message: string, canBeCropped = false) {
    super(message)
    this.name = 'FileValidationError'
    this.canBeCropped = canBeCropped
  }
}

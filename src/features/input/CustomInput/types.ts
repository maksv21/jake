// separate file to omit circular file dependency
export type InputRootElement = HTMLDivElement | null
export type InputElement = HTMLDivElement | null
export type CursorElement = HTMLDivElement | null

export type InputValue = string

export interface CursorPositionChangeHandler {
  (newPosition: number): void
}

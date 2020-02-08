/**
 * @packageDocumentation
 * @module errors
 */

/**
 * Will be thrown if a Node's ([[models.KPNode|`KPNode`]], [[models.KPStairsNode|`KPStairsNode`]], [[models.KPEndNode|`KPEndNode`]]) JSON
 * representation is malformatted.
 */
export default class InvalidNodeFormatError extends Error {
  /**
   * Creates a new InvalidNodeFormatError with the given/default error message.
   * @param msg The error message.
   */
  constructor(msg: string = 'Invalid node format!') {
    super(msg);
    Object.setPrototypeOf(this, InvalidNodeFormatError.prototype);
  }
}
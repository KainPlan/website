/**
 * @packageDocumentation
 * @module errors
 */

/**
 * Will be thrown if a map in JSON format is lacking attributes or has
 * attributes with unexpected types/values. It will also be thrown, if a map's node
 * is malformatted in [[models.KPMap.parse|KPMap.parse]].
 */
export default class InvalidMapFormatError extends Error {
  /**
   * Creates a new InvalidMapFormatError - usually with the default error message.
   * @param msg The error message.
   */
  constructor(msg: string = 'Invalid map format!') {
    super(msg);
    Object.setPrototypeOf(this, InvalidMapFormatError.prototype);
  }
}
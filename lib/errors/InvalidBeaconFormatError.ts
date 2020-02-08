/**
 * @packageDocumentation
 * @module errors
 */

/**
 * Will be thrown when a beacon in JSON format is missing a property
 * or has a property with an unexpected value/type. (Could be thrown in [[models.KPBeacon.parse|KPBeacon.parse]])
 */
export default class InvalidBeaconFormatError extends Error {
  /**
   * Creates a new InvalidBeaconFormatError - usually with the default error message.
   * @param msg The error message.
   */
  constructor(msg: string = 'Invalid beacon format!') {
    super(msg);
    Object.setPrototypeOf(this, InvalidBeaconFormatError.prototype);
  }
}
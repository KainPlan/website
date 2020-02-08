/**
 * @packageDocumentation
 * @module models
 */

import { InvalidBeaconFormatError } from "../errors";

/**
 * Represents a Beacon stored in the [[KPMap|KainPlan Map]].
 */
export default class KPBeacon {
  /**
   * X-Coordinate
   */
  public x: number;
  /**
   * Y-Coordinate
   */
  public y: number;

  /**
   * Creates a new KainPlan Beacon.
   * @param x X-Coordinate of the Beacon
   * @param y Y-Coordinate of the Beacon
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Creates and returns a new KPBeacon from the given JSON object/string.
   * @param json Either an object that has already been parsed, or a JSON string.
   * @returns The newly created KPBeacon.
   */
  static parse(json: any): KPBeacon {
    if (typeof json === 'string') json = JSON.parse(json);
    if (
      typeof json.x !== 'number'
      || typeof json.y !== 'number'
    ) throw new InvalidBeaconFormatError();
    return new KPBeacon(json.x, json.y);
  }

  /**
   * Converts the Beacon into a JSON object - will be called when using `JSON.stringify(...)`
   * @returns The Beacon in its JSON form.
   */
  public toJSON(): any {
    return {
      ...this,
    };
  }
}
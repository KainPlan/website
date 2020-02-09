/**
 * @packageDocumentation
 * @module models
 */

import KPNode from "./KPNode";
import { InvalidNodeFormatError } from "../errors";

/**
 * Represent a End-Node in the [[KPMap|KainPlan Map]].
 *
 * End-Points are the nodes a user can actually search for. They represent
 * important locations in the real world.
 */
export default class KPEndNode extends KPNode {
  /**
   * The end-point's title.
   */
  title: string;
  /**
   * The end-point's short description.
   */
  description: string;

  /**
   * Creates a new KainPlan End-Node
   * @param x X-Coordinate of the End-Point
   * @param y Y-Coordinate of the End-Point
   * @param title The title
   * @param description The short description
   * @param edges Connections to neighbouring nodes
   */
  constructor(x: number, y: number, title: string, description: string, edges?: KPNode[]) {
    super(x, y, edges);
    this.title = title;
    this.description = description;
  }

  /**
   * Creates and returns a new KPEndNode from the given JSON object/string.
   * @param json JSON object/string.
   */
  static parse(json: any): KPEndNode {
    if (typeof json === 'string') json = JSON.parse(json);
    const nudeNode: KPNode = KPNode.parse(json);
    if (typeof json.title !== 'string'
      || typeof json.description !== 'string') throw new InvalidNodeFormatError();
    return new KPEndNode(nudeNode.x, nudeNode.y, json.title, json.description);
  }

  /**
   * Converts the End-Point into a JSON object - used in `JSON.stringify(...)`.
   * Uses `KPNode.toJSON(...)`.
   * @param nodes All nodes on the same floor
   * @param allNodes All nodes on any floor
   */
  toJSON(nodes: KPNode[], allNodes?: KPNode[][]): any {
    return {
      ...super.toJSON(nodes),
      _type: 'KPEndNode',
    };
  }
}
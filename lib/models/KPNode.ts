/**
 * @packageDocumentation
 * @module models
 */

import { InvalidNodeFormatError } from "../errors";

/**
 * Represents a Node stored in the [[KPMap|KainPlan Map]].
 */
export default class KPNode {
  /**
   * X-Coordinate
   */
  x: number;
  /**
   * Y-Coordinate
   */
  y: number;
  /**
   * Connections to neighbouring nodes.
   */
  edges: KPNode[];

  /**
   * Creates a new KPNode with the given parameters.
   * @param x X-Coordinate
   * @param y Y-Coordinate
   * @param edges Connections to other nodes.
   */
  constructor(x: number, y: number, edges?: KPNode[]) {
    this.x = x;
    this.y = y;
    this.edges = edges || [];
  }

  /**
   * Creates a new KPNode from the given JSON object/string.
   * @param json JSON Object/String.
   */
  static parse(json: any): KPNode {
    if (typeof json === 'string') json = JSON.parse(json);
    if (
      typeof json.x !== 'number'
      || typeof json.y !== 'number'
    ) throw new InvalidNodeFormatError();
    return new KPNode(json.x, json.y);
  }

  /**
   * Parses the node's edges from the contents of a JSON structure.
   * @param json JSON representation of the node.
   * @param nodes All nodes on the same floor.
   * @param allNodes All nodes on all floors.
   */
  parseEdges(json: any, nodes: KPNode[], allNodes?: KPNode[][]): void {
    if (typeof json === 'string') json = JSON.parse(json);
    if (
      !Array.isArray(json.edges)
      || !json.edges.every((s: number) => typeof s === 'number')
    ) throw new InvalidNodeFormatError();
    this.edges = json.edges.map((e: number) => nodes[e]);
  }

  /**
   * Converts the node to its JSON representation.
   * (Neighbour-Nodes replaced with their respective indices)
   * @param nodes All nodes on the same floor.
   * @param allNodes All nodes on all floors.
   */
  toJSON(nodes: KPNode[], allNodes?: KPNode[][]): any {
    return {
      ...this,
      _type: 'KPNode',
      edges: this.edges.map(e => nodes.indexOf(e)),
    };
  }
}
/**
 * @packageDocumentation
 * @module models
 */

import KPNode from "./KPNode";
import { InvalidNodeFormatError } from "../errors";

/**
 * Represents a Stairs-Node in the [[KPMap|KainPlan Map]].
 * 
 * Stairs-Nodes represent staircases in the real world. They are the
 * only nodes that can have connections to nodes on other floors.
 */
export default class KPStairsNode extends KPNode {
  /**
   * The floor on which the other end of the staircase is situated.
   */
  floor: number;
  /**
   * The other end of the staircase.
   */
  stairs: KPNode;

  /**
   * Creates a new KainPlan Stairs-Node.
   * @param x The X-Coordinate of the staircase.
   * @param y The Y-Coordinate of the staircase.
   * @param floor The other floor.
   * @param edges The connections to neighbouring nodes.
   * @param stairs The other end of the staircase.
   */
  constructor(x: number, y: number, floor: number, edges?: KPNode[], stairs?: KPNode) {
    super(x, y, edges);
    this.floor = floor;
    this.stairs = stairs || null;
  }

  /**
   * Creates and returns a new KPStairsNode from the given JSON object/string.
   * @param json JSON object/string.
   */
  static parse(json: any): KPStairsNode {
    if (typeof json === 'string') json = JSON.parse(json);
    const nudeNode: KPNode = KPNode.parse(json);
    if (typeof json.floor !== 'number') throw new InvalidNodeFormatError();
    return new KPStairsNode(nudeNode.x, nudeNode.y, json.floor);
  }

  /**
   * Parse's the Stairs-Node's edges from the contents of a JSON structure.
   * @param json JSON representation of a KPStairsNode.
   * @param nodes All nodes on the same floor.
   * @param allNodes All nodes on all floors.
   */
  parseEdges(json: any, nodes: KPNode[], allNodes: KPNode[][]): void {
    super.parseEdges(json, nodes);
    if (typeof json.stairs !== 'number') throw new InvalidNodeFormatError();
    this.stairs = allNodes[this.floor][json.stairs];
    this.edges = [ this.stairs, ...this.edges ];
  }

  /**
   * Converts the Stairs-Node to its JSON representation. 
   * (Neighbour-Nodes replaced with their respective indices)
   * @param nodes All nodes on the same floor.
   * @param allNodes All nodes on any floor.
   */
  toJSON(nodes: KPNode[], allNodes: KPNode[][]): any {
    return {
      ...this,
      _type: 'KPStairsNode',
      edges: this.edges.slice(1).map(e => nodes.indexOf(e)),
      stairs: allNodes[this.floor].indexOf(this.stairs),
    };
  }
}
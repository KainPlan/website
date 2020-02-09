/**
 * @packageDocumentation
 * @module models
 */

import { InvalidMapFormatError, InvalidNodeFormatError, InvalidBeaconFormatError } from '../errors';
import KPNode from './KPNode';
import KPBeacon from './KPBeacon';
import { KPStairsNode, KPEndNode } from '.';

/**
 * Represents a Map in Project KainPlan. Contains all the information needed
 * to digitally represent a physical location.
 */
export default class KPMap {
  /**
   * The map's version
   */
  version: string;
  /**
   * The map's with (should be the width of the background-images)
   */
  width: number;
  /**
   * The map's height (should be the height of the background-images)
   */
  height: number;
  /**
   * The map's scale (m/pixel)
   */
  scale: number;
  /**
   * The background images URIs. (all images should be of the same size)
   */
  background: string[];
  /**
   * All nodes required for path finding. Contains [[KPNode|Intermediary Nodes]],
   * [[KPStairsNode|Staircases]] and [[KPEndNode|End-Points]].
   */
  nodes: KPNode[][];
  /**
   * Contains virtual represenations of the beacons placed in the facility.
   * They are used for user-positioning.
   */
  beacons: KPBeacon[][];

  /**
   * Creates a new KainPlan Map with the given parameters.
   * @param version The map's version.
   * @param width The map's width.
   * @param height The map's height.
   * @param scale The map's scale.
   * @param background The map's background sources.
   * @param nodes The map's nodes.
   * @param beacons The map's beacons.
   */
  constructor(version: string, width: number, height: number, scale: number, background: string[], nodes?: KPNode[][], beacons?: KPBeacon[][]) {
    if (version == null) throw new InvalidMapFormatError();
    this.version = version;
    this.width = width;
    this.height= height;
    this.scale = scale;
    this.background = background;
    this.nodes = nodes || background && new Array(background.length).fill(null).map(() => []) || null;
    this.beacons = beacons || background && new Array(background.length).fill(null).map(() => []) || null;
  }

  /**
   * Creates and returns a new KainPlan Map from the given JSON object/string.
   * Useful for parsing files, etc. It will, in turn, use the subsequent
   * `parse(...)` methods the nodes/beacons provide.
   * @param json JSON object/string.
   */
  static parse(json: any): KPMap {
    if (!json) throw new InvalidMapFormatError();
    if (typeof json === 'string') json = JSON.parse(json);
    if (
      typeof json.width !== 'number'
      || typeof json.height !== 'number'
      || typeof json.scale !== 'number'
      || !Array.isArray(json.background)
      || !json.background.every((s: string) => typeof s === 'string')
      || !Array.isArray(json.nodes)
      || !json.nodes.every((l: any[]) => Array.isArray(l))
      || !Array.isArray(json.beacons)
      || !json.beacons.every((l: any[]) => Array.isArray(l))
      || json.background.length !== json.nodes.length
      || json.background.length !== json.beacons.length
    ) throw new InvalidMapFormatError();
    const retMap = new KPMap(json.version, json.width, json.height, json.scale, json.background);
    try {
      for (let l: number = 0; l < json.background.length; l++) {
        json.nodes[l].forEach((n: any) => {
          let node: KPNode;
          if (typeof n._type !== 'string') throw new InvalidNodeFormatError();
          switch (n._type) {
            case 'KPNode':
              node = KPNode.parse(n);
              break;
            case 'KPStairsNode':
              node = KPStairsNode.parse(n);
              break;
            case 'KPEndNode':
              node = KPEndNode.parse(n);
              break;
            default:
              throw new InvalidNodeFormatError();
          }
          retMap.nodes[l].push(node);
        });
        json.beacons[l].forEach((b: any) => retMap.beacons[l].push(KPBeacon.parse(b)));
      }
      for (let l: number = 0; l < json.background.length; l++) {
        for (let i: number = 0; i < retMap.nodes[l].length; i++) {
          retMap.nodes[l][i].parseEdges(json.nodes[l][i], retMap.nodes[l], retMap.nodes);
        }
      }
    } catch (e) {
      if (
        e instanceof InvalidNodeFormatError
        || e instanceof InvalidBeaconFormatError
      ) throw new InvalidMapFormatError();
      throw e;
    }
    return retMap;
  }

  /**
   * Converts the map into its JSON representation - used when writing the map to a file, etc.
   * Uses the nodes'/beacons' `toJSON(...)` methods with the required parameters.
   */
  toJSON(): any {
    return {
      ...this,
      nodes: this.nodes.map((ns: KPNode[]) => ns.map((n: KPNode) => n.toJSON(ns, this.nodes))),
    };
  }
};
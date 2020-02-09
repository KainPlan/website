import { KPMap, KPNode, KPBeacon, KPEndNode } from ".";
import { InvalidMapFormatError } from "../errors";

type LoadingFunction = (start: boolean) => void;

declare global {
  interface Window { 
    controller: MapController;
  }
}

export default class MapController {
  map: KPMap;
  width: number;
  height: number;
  can: HTMLCanvasElement;
  loadingFn: LoadingFunction;
  ctx: CanvasRenderingContext2D;
  background: HTMLImageElement[];
  clockRate: number = 10;
  animTime: number = 100;
  animIntval: number;

  panScale: number = 0.3;
  panTime: number = 150;
  currentFloor: number = 0;
  magnifiy: number = 1;
  minMagnify: number = .75;
  maxMagnify: number = 2;
  offsetX: number = 0;
  offsetY: number = 0;

  public constructor(map: KPMap, width: number, height: number, can?: HTMLCanvasElement, loadingFn?: LoadingFunction) {
    // if (!(map instanceof KPMap)) throw new InvalidMapFormatError('Not a `KPMap`');
    this.map = map;
    this.width = width; 
    this.height = height;
    this.can = can || null;
    this.loadingFn = loadingFn || (() => undefined);
  }

  public init(can?: HTMLCanvasElement, loadingFn?: LoadingFunction) {
    if (can) this.can = can;
    if (loadingFn) this.loadingFn = loadingFn;

    console.log(this.map);

    this.ctx = can.getContext('2d');
    this.background = this.map.background
                      .map(b => {
                        let im = new Image();
                        im.src = b;
                        return im;
                      });

    this.switchFloor(0);
    window.controller = this;
  }

  private px2m(px: number): number {
    return px * this.map.scale * this.magnifiy;
  }

  private pxLoc2mLoc(pxX: number, pxY: number): number[] {
    return [
      this.px2m(pxX - this.offsetX),
      this.px2m(pxY - this.offsetY),
    ];
  }

  private m2px(m: number): number {
    return m * (1/this.map.scale) * this.magnifiy;
  }

  public resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  public switchFloor(fid: number) {
    this.currentFloor = fid;
    if (!this.background[fid].complete) {
      this.loadingFn(true);
      return this.background[fid].onload = () => {
        this.loadingFn(false);
        this.render();
      };
    }
    this.render();
  }

  public zoom(deltaMagnify: number, centerX: number, centerY: number): void {
    let previousMagnify = this.magnifiy;
    this.magnifiy = Math.round((this.magnifiy - deltaMagnify) * 100) / 100;

    if (this.magnifiy < this.minMagnify) this.magnifiy = this.minMagnify;
    else if (this.magnifiy > this.maxMagnify) this.magnifiy = this.maxMagnify;

    this.staticPan(
      ((centerX - this.offsetX) / previousMagnify) * this.magnifiy + this.offsetX - centerX,
      ((centerY - this.offsetY) / previousMagnify) * this.magnifiy + this.offsetY - centerY
    );
    this.render();
  }

  private staticPan(deltaX, deltaY) {
    let newOffsetX = this.offsetX - deltaX;
    let newOffsetY = this.offsetY - deltaY;

    if (newOffsetX > 0) {
      newOffsetX = 0;
    } else if (newOffsetX < Math.min(-this.m2px(this.map.width) + this.width, 0)) {
      newOffsetX = Math.min(-this.m2px(this.map.width) + this.width, 0);
    }

    if (newOffsetY > 0) {
      newOffsetY = 0;
    } else if (newOffsetY < Math.min(-this.m2px(this.map.height) + this.height, 0)) {
      newOffsetY = Math.min(-this.m2px(this.map.height) + this.height, 0);
    }

    deltaX = newOffsetX - this.offsetX;
    deltaY = newOffsetY - this.offsetY;

    this.ctx.translate(deltaX, deltaY);
    this.offsetX = newOffsetX;
    this.offsetY = newOffsetY;
    this.render();
  }

  public pan(deltaX: number, deltaY: number, clicks?: MouseEvent[], time?: number): void {
    window.clearInterval(this.animIntval);

    let animTime: number = time || this.panTime;
    let i: number = 0;
    let sum: number = Math.abs(deltaX) + Math.abs(deltaY);
    let xv: number = deltaX * this.panScale;
    let xa: number = -xv / animTime;
    let yv: number = deltaY * this.panScale;
    let ya: number = -yv / animTime;

    this.staticPan(deltaX, deltaY);
    this.animIntval = window.setInterval(() => {
      if (i++ >= this.panTime) window.clearInterval(this.animIntval);
      if (i > 15 && ((clicks && clicks.length === 0) || !clicks)) {
        this.staticPan(xv, yv);
        xv += xa;
        yv += ya;
      }
    }, 1);
  }

  public panIntoView(target: KPNode|KPBeacon, fid: number) {
    window.clearInterval(this.animIntval);
    this.switchFloor(fid);

    let i: number = 0;
    let padX: number = this.px2m(this.width/2);
    let padY: number = this.px2m(this.height/2);
    let stepX: number = (target.x + this.px2m(this.offsetX) - padX) / this.animTime;
    let stepY: number = (target.y + this.px2m(this.offsetY) - padY) / this.animTime;

    this.animIntval = window.setInterval(() => {
      if (i >= this.animTime) window.clearInterval(this.animIntval);
      this.staticPan(this.m2px(stepX), this.m2px(stepY));
      i++;
    }, 1);
  }

  public findEndNodes(query: string): KPEndNode[] {
    let endNodes: KPEndNode[] = [];
    for (let floor of this.map.nodes) endNodes = [...endNodes, ... floor.filter(n => n instanceof KPEndNode) as KPEndNode[]];
    return endNodes.filter(n => n.title.toLowerCase().includes(query.toLowerCase()) || n.description.toLowerCase().includes(query.toLowerCase()));
  }

  public render(): void {
    this.ctx.clearRect(0, 0, 
      this.width + this.m2px(this.map.width), 
      this.height + this.m2px(this.map.height));
    this.ctx.drawImage(this.background[this.currentFloor], 
      0, 0, this.m2px(this.map.width), this.m2px(this.map.height));
  }
};
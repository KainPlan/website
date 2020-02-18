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
  maxMagnify: number = 10;
  offsetX: number = 0;
  offsetY: number = 0;

  render: ()=>void;

  public constructor(map: KPMap, width: number, height: number, can?: HTMLCanvasElement, loadingFn?: LoadingFunction) {
    if (!(map instanceof KPMap)) throw new InvalidMapFormatError('Not a `KPMap`');
    this.map = map;
    this.width = width; 
    this.height = height;
    this.can = can || null;
    this.loadingFn = loadingFn || (() => undefined);
  }

  public init(can?: HTMLCanvasElement, loadingFn?: LoadingFunction, adminMode?: boolean) {
    if (can) this.can = can;
    if (loadingFn) this.loadingFn = loadingFn;
    this.ctx = can.getContext('2d');
    this.background = this.map.background
                      .map(b => {
                        let im = new Image();
                        im.src = b;
                        return im;
                      });
    this.render = adminMode ? this.renderAdmin : this.renderNormal;
    this.switchFloor(0);
    window.controller = this;
  }

  public reset() {
    this.ctx.translate(-this.offsetX, -this.offsetY);
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
    let prevX: number = this.offsetX;
    let prevY: number = this.offsetY;
    this.offsetX = 0;
    this.offsetY = 0;
    this.staticPan(-prevX, -prevY);
    this.render();
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
    let xv: number = deltaX * this.panScale * (1/Math.max(1, this.magnifiy));
    let xa: number = -xv / animTime;
    let yv: number = deltaY * this.panScale * (1/Math.max(1, this.magnifiy));
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

  public renderNormal(): void {
    this.ctx.clearRect(0, 0, 
      this.width + this.m2px(this.map.width), 
      this.height + this.m2px(this.map.height));
    this.ctx.drawImage(this.background[this.currentFloor], 
      0, 0, this.m2px(this.map.width), this.m2px(this.map.height));
  }

  private drawGrid(): void {
    let prevWidth = this.ctx.lineWidth;
    let prevStyle = this.ctx.strokeStyle;
    this.ctx.beginPath();
    this.ctx.lineWidth = 2;
    for (let y = 1; y < this.map.height; y+=5) {
      this.ctx.moveTo(0, this.m2px(y));
      this.ctx.lineTo(this.m2px(this.map.width), this.m2px(y));
    }
    for (let x = 1; x < this.map.width; x+=5) {
      this.ctx.moveTo(this.m2px(x), 0);
      this.ctx.lineTo(this.m2px(x), this.m2px(this.map.height));
    }
    this.ctx.strokeStyle = '#f2f2f2';
    this.ctx.stroke();
    this.ctx.strokeStyle = prevStyle;
    this.ctx.lineWidth = prevWidth;
  }

  private drawNodes(): void {
    let prevStyle = this.ctx.strokeStyle;
    let prevFillStyle = this.ctx.fillStyle;
    let prevWidth = this.ctx.lineWidth;
    this.ctx.fillStyle = 'rgba(255, 45, 97, .4)';
    for (let i = 0; i < this.map.nodes[this.currentFloor].length; i++) {
      let n: KPNode = this.map.nodes[this.currentFloor][i];
      this.ctx.beginPath();
      this.ctx.lineWidth = this.m2px(.1);
      this.ctx.strokeStyle = '#FF2D61';
      this.ctx.ellipse(this.m2px(n.x), this.m2px(n.y), 
        this.m2px(.5), this.m2px(.5), 0, 0, 2 * Math.PI);
      this.ctx.stroke();
      this.ctx.fill();
      n.edges.filter(tn => !this.map.nodes[this.currentFloor].slice(0, i).includes(tn)).forEach(tn => {
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#FF622D';
        this.ctx.lineWidth = this.m2px(.25);
        this.ctx.moveTo(this.m2px(n.x), this.m2px(n.y));
        this.ctx.lineTo(this.m2px(tn.x), this.m2px(tn.y));
        this.ctx.stroke();
      });
    }
    this.ctx.lineWidth = prevWidth;
    this.ctx.fillStyle = prevFillStyle;
    this.ctx.strokeStyle = prevStyle;
  }

  public renderAdmin(): void {
    this.renderNormal();
    // this.drawGrid();
    this.drawNodes();
  }
};
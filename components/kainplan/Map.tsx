import React from 'react';
import { KPMap, MapController } from '../../lib/models';

type LoadingFunction = (start: boolean) => void;

interface MapProps {
  children?: React.ReactNode;
  fullscreen?: boolean;
  width?: number;
  height?: number;
  map: KPMap;
  clockRate?: number;
  animTime?: number;
  loadingFn?: LoadingFunction;
}

interface MapState {
  children?: React.ReactNode;
  fullscreen?: boolean;
  width: number;
  height: number;
  loadingFn: LoadingFunction;
}

class Map extends React.Component<MapProps, MapState> {
  canvas: HTMLCanvasElement;
  controller: MapController;
  clicks: any[] = [];
  lastTime: number = new Date().getTime();
  minTimeDiff: number = 10;
  scrollMultiplier: number = 0.005;

  public constructor(props) {
    super(props);
    this.state = {
      children: props.children,
      fullscreen: props.fullscreen,
      width: props.width||800,
      height: props.height||600,
      loadingFn: props.loadingFn || (() => undefined),
    };
    this.controller = new MapController(props.map, this.state.width, this.state.height);
  }

  public componentDidMount() {
    this.controller.init(this.canvas, this.state.loadingFn);
    if (this.state.fullscreen) {
      window.onresize = this.onWindowResize.bind(this);
      this.onWindowResize();
    }
  }

  private onWindowResize() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    }, () => {
      this.controller.resize(window.innerWidth, window.innerHeight);
    });
  }

  private onMouseDown(e: PointerEvent) {
    this.clicks.push({...e});
    this.lastTime = new Date().getTime();
  }

  private onMouseMove(e: PointerEvent) {
    if (this.clicks.length === 1 && new Date().getTime() - this.lastTime > this.minTimeDiff) {
      this.controller.pan(
        this.clicks[0].clientX - e.clientX,
        this.clicks[0].clientY - e.clientY,
        this.clicks,
      );
      this.clicks[0] = {...e};
      this.lastTime = new Date().getTime();
    }
  }

  private onMouseZoom(e: WheelEvent) {
    e.preventDefault();
    let cab: DOMRect = this.canvas.getBoundingClientRect();
    this.controller.zoom(e.deltaY*this.scrollMultiplier, 
      e.clientX - cab.left, e.clientY - cab.top);
  }

  private onMouseUp(e: PointerEvent) {
    this.clicks.pop();
  }

  private onTouchDown(e: PointerEvent) {
    this.clicks.push({...e});
    this.lastTime = new Date().getTime();
  }

  private onTouchMove(e: PointerEvent) {
    if (new Date().getTime() - this.lastTime > this.minTimeDiff) {
      if (this.clicks.length === 1) {
        this.controller.pan(
          (this.clicks[0].clientX - e.clientX),
          (this.clicks[0].clientY - e.clientY),
          this.clicks,
        );
        this.clicks[0] = {...e};
        this.lastTime = new Date().getTime();
      } else if (this.clicks.length === 2) {
        let otherIndex: number = this.clicks[0].pointerId===e.pointerId ? 1 : 0;
        let dX: number = Math.abs(e.clientX-this.clicks[otherIndex].clientX);
        let dY: number = Math.abs(e.clientY-this.clicks[otherIndex].clientY);
        let currDiff: number = Math.max(dX, dY);
        let prevDiff: number = Math.max(
          Math.abs(this.clicks[1-otherIndex].clientX-this.clicks[otherIndex].clientX),
          Math.abs(this.clicks[1-otherIndex].clientY-this.clicks[otherIndex].clientY),
        );
        let compDiff: number = prevDiff-currDiff;
        let cab: DOMRect = this.canvas.getBoundingClientRect();
        this.controller.zoom(compDiff * 0.02,
          Math.min(e.clientX, this.clicks[otherIndex].clientX) - cab.left + dX / 2,
          Math.min(e.clientY, this.clicks[otherIndex].clientY) - cab.top + dY / 2);

        this.clicks[1-otherIndex] = {...e};
        this.lastTime = new Date().getTime();
      }
    }
  }

  private onTouchUp(e: PointerEvent) {
    for (let i = 0; i < this.clicks.length; i++) {
      if ((this.clicks[i] as PointerEvent).pointerId === e.pointerId) {
        this.clicks.splice(i,1);
        return;
      }
    }
  }

  private onDown(e: PointerEvent) {
    e.preventDefault();
    switch(e.pointerType) {
      case 'mouse':
        this.onMouseDown(e);
        break;
      default:
        this.onTouchDown(e);
        break;
    }
  }

  private onMove(e: PointerEvent) {
    e.preventDefault();
    switch(e.pointerType) {
      case 'mouse':
        this.onMouseMove(e);
        break;
      default:
        this.onTouchMove(e);
        break;
    }
  }

  private onUp(e: PointerEvent) {
    e.preventDefault();
    switch(e.pointerType) {
      case 'mouse':
        this.onMouseUp(e);
        break;
      default:
        this.onTouchUp(e);
        break;
    }
  }

  public switchFloor(fid) {
    this.controller.switchFloor(fid);
  }
  
  private renderMap() {
    
  }

  public render() {
    return (
      <>
        <canvas 
          ref={e => this.canvas = e} 
          width={this.state.width} 
          height={this.state.height}
          onWheel={this.onMouseZoom.bind(this)}
          onPointerDown={this.onDown.bind(this)}
          onPointerMove={this.onMove.bind(this)}
          onPointerUp={this.onUp.bind(this)}
          onPointerCancel={this.onUp.bind(this)}
          onPointerOut={this.onUp.bind(this)}
          onPointerLeave={this.onUp.bind(this)}  
        ></canvas>
        <div>
          {this.state.children}
        </div>
        <style jsx>{`
          canvas {
            position: relative;
            touch-action: none;
          }
        `}</style>
      </>
    );
  }
}

export default Map;
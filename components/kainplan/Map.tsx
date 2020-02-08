import React from 'react';
import KPMap from '../../lib/models/KPMap';

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
  width?: number;
  height?: number;
  can: React.RefObject<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  map: KPMap;
  background: HTMLImageElement[];
  clockRate: number;
  animTime: number;
  animIntval: number;
  loadingFn: LoadingFunction;
}

class Map extends React.Component<MapProps, MapState> {
  public constructor(props) {
    super(props);
    this.state = {
      children: props.children,
      fullscreen: props.fullscreen,
      width: props.width || 800,
      height: props.height || 600,
      can: React.createRef(),
      ctx: null,
      map: props.map,
      background: new Array(props.map.background.length)
                      .fill(null),
      clockRate: props.clockRate || 10,
      animTime: props.animTime || 100,
      animIntval: props.animIntval || null,
      loadingFn: props.loadingFn || (() => undefined),
    };
  }

  public componentDidMount() {
    if (this.state.fullscreen) {
      window.onresize = this.onWindowResize.bind(this);
      this.onWindowResize();
    }
    this.setState({ 
      ctx: this.state.can.current.getContext('2d'),
      background: this.state.map.background
                  .map(b => {
                    let im = new Image();
                    im.src = b;
                    return im;
                  }),
    }, () => {
      this.onSwitchFloor(0);
    });
  }

  private onWindowResize() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  private onMouseDown() {

  }

  private onMouseMove() {

  }

  private onMouseZoom() {

  }

  private onMouseUp() {

  }

  private onTouchDown() {

  }

  private onTouchMove() {

  }

  private onTouchUp() {

  }

  private onSwitchFloor(fid) {
    let draw_floor = () => {
      this.state.ctx.drawImage(this.state.background[fid], 0, 0, 
        this.state.map.width, this.state.map.height);
    };
    if (!this.state.background[fid].complete) {
      this.state.loadingFn(true);
      return this.state.background[fid].onload = () => {
        this.state.loadingFn(false);
        draw_floor();
      };
    }
    draw_floor();
  }

  public switchFloor(fid) {
    this.onSwitchFloor(fid);
  }

  public render() {
    return (
      <>
        <canvas 
          ref={this.state.can} 
          width={this.state.width} 
          height={this.state.height}
          onWheel={this.onMouseZoom.bind(this)}
          onMouseDown={this.onMouseDown.bind(this)}
          onMouseMove={this.onMouseMove.bind(this)}
          onMouseUp={this.onMouseUp.bind(this)}
          onMouseLeave={this.onMouseUp.bind(this)}
          onMouseOut={this.onMouseUp.bind(this)}
          onPointerDown={this.onTouchDown.bind(this)}
          onPointerMove={this.onTouchMove.bind(this)}
          onPointerUp={this.onTouchUp.bind(this)}
          onPointerCancel={this.onTouchUp.bind(this)}
          onPointerOut={this.onTouchUp.bind(this)}
          onPointerLeave={this.onTouchUp.bind(this)}  
        ></canvas>
        <div>
          {this.state.children}
        </div>
        <style jsx>{`
          canvas {
            ${this.state.fullscreen ? `
              width: 100%;
              height: 100%;
            `: `
              width: ${this.state.width}px;
              height: ${this.state.height}px;
            `}
            background-color: #DFF8FF;
            position: relative;
          }
        `}</style>
      </>
    );
  }
}

export default Map;
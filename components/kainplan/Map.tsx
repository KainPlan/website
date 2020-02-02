import React from 'react';
import KPMap from '../../lib/models/KPMap';

interface MapProps {
  children?: React.ReactNode;
  fullscreen?: boolean;
  width?: number;
  height?: number;
  map: KPMap;
  clockRate?: number;
  animTime?: number;
}

interface MapState {
  children?: React.ReactNode;
  fullscreen?: boolean;
  width?: number;
  height?: number;
  can: React.RefObject<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  map: KPMap;
  clockRate: number;
  animTime: number;
  animIntval: number;
}

class Map extends React.Component<MapProps, MapState> {
  constructor(props) {
    super(props);
    this.state = {
      children: props.children,
      fullscreen: props.fullscreen,
      width: props.width || 800,
      height: props.height || 600,
      can: React.createRef(),
      ctx: null,
      map: props.map,
      clockRate: props.clockRate || 10,
      animTime: props.animTime || 100,
      animIntval: props.animIntval || null,
    };
  }

  componentDidMount() {
    if (this.state.fullscreen) {
      window.onresize = this.onWindowResize.bind(this);
      this.onWindowResize();
    }
    this.setState({ 
      ctx: this.state.can.current.getContext('2d'),
    });
  }

  onWindowResize() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  render() {
    return (
      <>
        <canvas ref={this.state.can} width={this.state.width} height={this.state.height}></canvas>
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
            background-color: lightblue;
            position: relative;
          }
        `}</style>
      </>
    );
  }
}

export default Map;
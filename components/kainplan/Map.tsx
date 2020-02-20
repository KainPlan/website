import React from 'react';
import { KPMap, MapController } from '../../lib/models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

if (process.env.NODE_ENV === 'development') process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

type LoadingFunction = (start: boolean) => void;

export interface MapInfo {
  name: string;
  timestamp: number;
}

interface MapProps {
  children?: React.ReactNode;
  fullscreen?: boolean;
  width?: number;
  height?: number;
  map?: KPMap;
  adminMode?: boolean;
  animTime?: number;
  loadingFn?: LoadingFunction;
}

interface MapState {
  width: number;
  height: number;
  map: KPMap;
  name: string;
  currentFloor: number;
}

class Map extends React.Component<MapProps, MapState> {
  public constructor(props) {
    super(props);
    this.state = {
      width: props.width||800,
      height: props.height||600,
      map: null,
      name: '',
      currentFloor: 0,
    };
    if (props.map) this.controller = new MapController(props.map, this.state.width, this.state.height);
  }

  canvas: HTMLCanvasElement;
  controller: MapController;
  clicks: any[] = [];
  lastTime: number = new Date().getTime();
  minTimeDiff: number = 10;
  scrollMultiplier: number = 0.005;

  public componentDidMount() {
    if (this.controller) this.controller.init(this.canvas, this.props.loadingFn, this.props.adminMode);
    if (this.props.fullscreen) {
      window.addEventListener('resize', this.onResize.bind(this));
      this.onResize();
    }
  }

  public getAvailableMaps(tkn: string, cb: (avail: MapInfo[])=>void) {
    this.props.loadingFn(true);
    fetch(`https://localhost:42069/maps/${tkn}`)
      .then(res => res.json())
      .then(res => {
        cb(res.maps);
      });
  }

  public loadMap(name: string, tkn: string, cb?: ()=>void) {
    this.props.loadingFn(true);
    fetch(`https://localhost:42069/map/${name}/${tkn}`)
      .then(res => res.json())
      .then(res => {
        if (!res.success) return;
        this.props.loadingFn(false);
        this.setState({
          name,
          currentFloor: 0, 
        }, () => this.provideMap(res.map, cb));
      });
  }

  public provideMap(map: KPMap, cb?: ()=>void) {
    map = KPMap.parse(map);
    this.setState({ 
      map,
    }, () => {
      if (this.controller) this.controller.reset();
      this.controller = new MapController(map, this.state.width, this.state.height);
      this.controller.init(this.canvas, this.props.loadingFn, this.props.adminMode);
      if (cb) cb();
    });
  }

  public saveMap(name: string, tkn: string, newVersion?: string, cb?: ()=>void) {
    this.props.loadingFn(true);
    this.state.map.version = newVersion || this.state.map.version.substr(0,this.state.map.version.lastIndexOf('.') + 1) + (+this.state.map.version.split('.').slice(-1)[0] + 1);
    fetch(`https://localhost:42069/map/${name}/${tkn}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state.map.toJSON()),
    }).then(res => res.json())
      .then(res => {
        console.log(res);
        if (!res.success) return;
        this.props.loadingFn(false);
        if (cb) cb();
      });
  }

  private onResize() {
    this.resize(window.innerWidth, window.innerHeight);
  }

  public resize(width: number, height: number) {
    this.setState({
      width, height,
    }, () => {
      if (this.controller) this.controller.resize(width, height);
    });
  }

  private onMouseDown(e: React.PointerEvent) {
    this.clicks.push({...e});
    this.lastTime = new Date().getTime();
  }

  private onMouseMove(e: React.PointerEvent) {
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

  private onMouseZoom(e: React.WheelEvent) {
    let cab: DOMRect = this.canvas.getBoundingClientRect();
    this.controller.zoom(e.deltaY*this.scrollMultiplier, 
      e.clientX - cab.left, e.clientY - cab.top);
  }

  private onMouseUp(e: React.PointerEvent) {
    this.clicks.pop();
  }

  private onTouchDown(e: React.PointerEvent) {
    this.clicks.push({...e});
    this.lastTime = new Date().getTime();
  }

  private onTouchMove(e: React.PointerEvent) {
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

  private onTouchUp(e: React.PointerEvent) {
    for (let i = 0; i < this.clicks.length; i++) {
      if ((this.clicks[i] as PointerEvent).pointerId === e.pointerId) {
        this.clicks.splice(i,1);
        return;
      }
    }
  }

  private onDown(e: React.PointerEvent) {
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

  private onMove(e: React.PointerEvent) {
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

  private onUp(e: React.PointerEvent) {
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

  public onAddFloor() {
  }

  public switchFloor(fid) {
    this.setState({
      currentFloor: fid,
    });
    this.controller.switchFloor(fid);
  }

  public render() {
    return (
      <>
        <div className="map-root">
          <canvas 
            ref={e => this.canvas = e} 
            width={this.state.width} 
            height={this.state.height}
            onWheel={e => this.controller ? this.onMouseZoom(e) : undefined}
            onPointerDown={e => this.controller ? this.onDown(e) : undefined}
            onPointerMove={e => this.controller ? this.onMove(e) : undefined}
            onPointerUp={e => this.controller ? this.onUp(e) : undefined}
            onPointerCancel={e => this.controller ? this.onUp(e) : undefined}
            onPointerOut={e => this.controller ? this.onUp(e) : undefined}
            onPointerLeave={e => this.controller ? this.onUp(e) : undefined}  
          ></canvas>
          <div>
            { this.props.children }
          </div>
          <div>
            { this.props.adminMode && 
              <div 
                style={{
                  borderColor: '#622dff',
                  color: '#622dff',
                }}
                onClick={this.onAddFloor.bind(this)}
              >
                <FontAwesomeIcon icon={faPlus} />
              </div> 
            }
            { this.state.map && 
              this.state.map.background.map((_, i) => 
                <div 
                  style={{
                    borderColor: this.state.currentFloor === this.state.map.background.length-i-1 ? '#622dff' : '#303841',
                  }}
                  onClick={() => this.switchFloor(this.state.map.background.length-i-1)}
                ></div>
              ) 
            }
          </div>
        </div>
        <style jsx>{`
          .map-root {
            width: ${this.state.width}px;
            height: ${this.state.height}px;
            box-sizing: border-box;
            margin: 0;

            canvas {
              position: relative;
              touch-action: none;
              width: 100%;
              height: 100%;
            }

            & > div:last-child {
              position: absolute;
              right: 7.5px;
              bottom: 7.5px;
              display: flex;
              flex-direction: column;

              & > div {
                width: 1.1em;
                height: 1.1em;
                border-radius: 50%;
                border: 2px solid #303841;
                background-color: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: .2s ease;

                &:hover {
                  cursor: pointer;
                  opacity: .8;
                  transform: scale(1.1);
                }

                &:not(:last-child) {
                  margin-bottom: 2.5px;
                }
              }
            }
          }
        `}</style>
      </>
    );
  }
}

export default Map;
import React from 'react';
import anime from 'animejs';

interface LoadingProps {
}

interface LoadingState extends LoadingProps {
  visible: boolean;
  anim: boolean;
  width: number;
  height: number;
}

class Loading extends React.Component<LoadingProps, LoadingState> {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      anim: false,
      width: 0,
      height: 0,
    };
  }

  backPoly: SVGPolygonElement;

  componentDidMount() {
    window.onresize = () => this.onResize();
    this.onResize();
  }

  onResize() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  show() {
    anime.remove(this.backPoly);
    this.setState({
      visible: true,
    }, () => anime({
      targets: this.backPoly,
      points: [
        `${this.state.width/2-30} ${this.state.height/2-30} ${this.state.width/2} ${this.state.height/2-10} ${this.state.width/2} ${this.state.height/2} 
          ${this.state.width/2-25} ${this.state.height/2} ${this.state.width/2+25} ${this.state.height/2+10} 
          ${this.state.width/2-5} ${this.state.height/2+30} ${this.state.width/2-20} ${this.state.height/2+10} 
          ${this.state.width/2+15} ${this.state.height/2-5}`,
        `0 0 ${this.state.width/2} 0 ${this.state.width} 0 
          ${this.state.width} ${this.state.height/2} ${this.state.width} ${this.state.height}
          ${this.state.width/2} ${this.state.height} 0 ${this.state.height}
          0 ${this.state.height/2}`,
      ],
      opacity: [0, 1],
      easing: 'cubicBezier(.2, .3, .6, .3)',
      duration: 400,
      loop: false,
    }).finished.then(() => this.setState({ 
        visible: true,
        anim: true, 
    })));
  }

  hide() {
    anime.remove(this.backPoly);
    this.setState({
      anim: false,
    }, () => anime({
      targets: this.backPoly,
      points: [
        `0 0 ${this.state.width/2} 0 ${this.state.width} 0 
          ${this.state.width} ${this.state.height/2} ${this.state.width} ${this.state.height}
          ${this.state.width/2} ${this.state.height} 0 ${this.state.height}
          0 ${this.state.height/2}`,
        `${this.state.width/2-30} ${this.state.height/2-30} ${this.state.width/2} ${this.state.height/2-10} ${this.state.width/2} ${this.state.height/2} 
          ${this.state.width/2-25} ${this.state.height/2} ${this.state.width/2+25} ${this.state.height/2+10} 
          ${this.state.width/2-5} ${this.state.height/2+30} ${this.state.width/2-20} ${this.state.height/2+10} 
          ${this.state.width/2+15} ${this.state.height/2-5}`,
      ],
      opacity: [1, 0],
      easing: 'linear',
      duration: 300,
      loop: false,
    }).finished.then(() => this.setState({
      visible: false,
    })));
  }

  render() {
    return (
      <>
        <div 
          className="loading-back"
          style={{
            display: this.state.visible ? 'flex' : 'none',
          }}
        >
          <svg width={this.state.width} height={this.state.height} 
            viewBox={`0 0 ${this.state.width} ${this.state.height}`}
            xmlns="http://www.w3.org/2000/svg">
            <polygon
              ref={e => this.backPoly = e} 
              points={
                this.state.visible
                ? `0 0 ${this.state.width/2} 0 ${this.state.width} 0 
                   ${this.state.width} ${this.state.height/2} ${this.state.width} ${this.state.height}
                   ${this.state.width/2} ${this.state.height} 0 ${this.state.height}
                   0 ${this.state.height/2}`
                : `${this.state.width/2-30} ${this.state.height/2-30} ${this.state.width/2} ${this.state.height/2-10} ${this.state.width/2} ${this.state.height/2} 
                   ${this.state.width/2-25} ${this.state.height/2} ${this.state.width/2+25} ${this.state.height/2+10} 
                   ${this.state.width/2-5} ${this.state.height/2+30} ${this.state.width/2-20} ${this.state.height/2+10} 
                   ${this.state.width/2+15} ${this.state.height/2-5}`
              }
            />
          </svg>
          <svg width="386" height="77" viewBox="0 0 384.229 75.977" 
            xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#FF6188"/>
                <stop offset="100%" stopColor="#8961FF"/>
              </linearGradient>
            </defs>
            <g 
              id="svgGroup" 
              strokeLinecap="round" 
              fillRule="evenodd" 
              fontSize="9pt" 
              stroke="url(#grad)" 
              strokeWidth="0.5mm" 
              fill="none"
              style={{
                animation: this.state.anim ? '' : 'none',
              }}
            >
              <path 
                d="M 41.797 75 L 20.41 44.287 L 12.354 52.832 L 12.354 75 L 0 75 L 0 3.906 L 12.354 3.906 L 12.354 37.256 L 19.189 28.809 L 39.99 3.906 L 54.932 3.906 L 28.516 35.4 L 56.445 75 L 41.797 75 Z M 141.357 22.168 L 152.539 22.168 L 152.881 28.271 A 18.764 18.764 0 0 1 166.509 21.254 A 24.301 24.301 0 0 1 168.262 21.191 A 20.551 20.551 0 0 1 175.305 22.3 Q 184.837 25.768 185.059 40.088 L 185.059 75 L 173.193 75 L 173.193 40.771 A 18.489 18.489 0 0 0 173.007 38.049 Q 172.557 35.034 171.021 33.325 A 6.501 6.501 0 0 0 168.431 31.611 Q 166.574 30.908 163.916 30.908 A 12.422 12.422 0 0 0 158.957 31.86 Q 156.062 33.106 154.087 35.985 A 15.784 15.784 0 0 0 153.223 37.402 L 153.223 75 L 141.357 75 L 141.357 22.168 Z M 340.527 22.168 L 351.709 22.168 L 352.051 28.271 A 18.764 18.764 0 0 1 365.679 21.254 A 24.301 24.301 0 0 1 367.432 21.191 A 20.551 20.551 0 0 1 374.475 22.3 Q 384.007 25.768 384.229 40.088 L 384.229 75 L 372.363 75 L 372.363 40.771 A 18.489 18.489 0 0 0 372.177 38.049 Q 371.727 35.034 370.19 33.325 A 6.501 6.501 0 0 0 367.601 31.611 Q 365.744 30.908 363.086 30.908 A 12.422 12.422 0 0 0 358.127 31.86 Q 355.232 33.106 353.256 35.985 A 15.784 15.784 0 0 0 352.393 37.402 L 352.393 75 L 340.527 75 L 340.527 22.168 Z M 105.566 75 L 93.457 75 Q 92.813 73.752 92.301 71.209 A 40.514 40.514 0 0 1 92.09 70.068 A 18.423 18.423 0 0 1 78.733 75.971 A 22.455 22.455 0 0 1 78.223 75.977 A 22.778 22.778 0 0 1 72.345 75.256 A 16.956 16.956 0 0 1 65.234 71.436 A 15.096 15.096 0 0 1 61.319 66.027 A 14.978 14.978 0 0 1 60.205 60.205 A 18.076 18.076 0 0 1 61.051 54.532 A 14.345 14.345 0 0 1 66.479 47.241 Q 72.754 42.725 84.424 42.725 L 91.699 42.725 L 91.699 39.258 Q 91.699 35.156 89.404 32.69 A 7.165 7.165 0 0 0 86.346 30.785 Q 85.184 30.4 83.765 30.279 A 15.907 15.907 0 0 0 82.422 30.225 A 13.271 13.271 0 0 0 79.493 30.531 A 9.232 9.232 0 0 0 75.781 32.251 A 7.054 7.054 0 0 0 74.082 34.117 A 6.173 6.173 0 0 0 73.193 37.402 L 61.328 37.402 A 12.876 12.876 0 0 1 63.514 30.257 A 16.331 16.331 0 0 1 64.209 29.272 A 18.192 18.192 0 0 1 69.559 24.597 A 22.974 22.974 0 0 1 72.046 23.34 A 26.106 26.106 0 0 1 79.763 21.361 A 32.142 32.142 0 0 1 83.105 21.191 A 29.922 29.922 0 0 1 89.257 21.787 Q 93.08 22.59 96.031 24.477 A 17.484 17.484 0 0 1 97.9 25.854 A 15.565 15.565 0 0 1 103.201 35.213 A 22.671 22.671 0 0 1 103.564 38.965 L 103.564 62.793 A 41.459 41.459 0 0 0 103.78 67.161 Q 104.011 69.336 104.49 71.154 A 17.54 17.54 0 0 0 105.566 74.17 L 105.566 75 Z M 330.273 75 L 318.164 75 Q 317.52 73.752 317.009 71.209 A 40.514 40.514 0 0 1 316.797 70.068 A 18.423 18.423 0 0 1 303.44 75.971 A 22.455 22.455 0 0 1 302.93 75.977 A 22.778 22.778 0 0 1 297.052 75.256 A 16.956 16.956 0 0 1 289.941 71.436 A 15.096 15.096 0 0 1 286.026 66.027 A 14.978 14.978 0 0 1 284.912 60.205 A 18.076 18.076 0 0 1 285.758 54.532 A 14.345 14.345 0 0 1 291.187 47.241 Q 297.461 42.725 309.131 42.725 L 316.406 42.725 L 316.406 39.258 Q 316.406 35.156 314.111 32.69 A 7.165 7.165 0 0 0 311.053 30.785 Q 309.891 30.4 308.472 30.279 A 15.907 15.907 0 0 0 307.129 30.225 A 13.271 13.271 0 0 0 304.2 30.531 A 9.232 9.232 0 0 0 300.488 32.251 A 7.054 7.054 0 0 0 298.789 34.117 A 6.173 6.173 0 0 0 297.9 37.402 L 286.035 37.402 A 12.876 12.876 0 0 1 288.221 30.257 A 16.331 16.331 0 0 1 288.916 29.272 A 18.192 18.192 0 0 1 294.266 24.597 A 22.974 22.974 0 0 1 296.753 23.34 A 26.106 26.106 0 0 1 304.47 21.361 A 32.142 32.142 0 0 1 307.813 21.191 A 29.922 29.922 0 0 1 313.964 21.787 Q 317.787 22.59 320.738 24.477 A 17.484 17.484 0 0 1 322.607 25.854 A 15.565 15.565 0 0 1 327.908 35.213 A 22.671 22.671 0 0 1 328.271 38.965 L 328.271 62.793 A 41.459 41.459 0 0 0 328.487 67.161 Q 328.718 69.336 329.197 71.154 A 17.54 17.54 0 0 0 330.273 74.17 L 330.273 75 Z M 225.342 48.584 L 210.645 48.584 L 210.645 75 L 198.291 75 L 198.291 3.906 L 225.488 3.906 A 37.052 37.052 0 0 1 233.338 4.69 Q 238.459 5.8 242.336 8.482 A 22.096 22.096 0 0 1 244.409 10.107 A 20.436 20.436 0 0 1 251.354 24.635 A 28.167 28.167 0 0 1 251.416 26.514 A 25.509 25.509 0 0 1 250.53 33.425 A 18.538 18.538 0 0 1 244.556 42.773 A 22.749 22.749 0 0 1 236.322 47.131 Q 233.02 48.13 229.068 48.442 A 47.349 47.349 0 0 1 225.342 48.584 Z M 273.682 0 L 273.682 75 L 261.816 75 L 261.816 0 L 273.682 0 Z M 128.613 22.168 L 128.613 75 L 116.748 75 L 116.748 22.168 L 128.613 22.168 Z M 210.645 13.867 L 210.645 38.672 L 225.488 38.672 A 22.471 22.471 0 0 0 229.303 38.369 Q 233.163 37.703 235.547 35.571 A 10.007 10.007 0 0 0 238.585 30.39 Q 238.987 28.779 239.012 26.867 A 19.499 19.499 0 0 0 239.014 26.611 A 15.318 15.318 0 0 0 238.519 22.616 A 11.243 11.243 0 0 0 235.498 17.407 Q 232.065 14.046 226.117 13.874 A 22.037 22.037 0 0 0 225.83 13.867 L 210.645 13.867 Z M 91.699 60.156 L 91.699 50.195 L 85.303 50.195 A 30.591 30.591 0 0 0 81.854 50.377 Q 78.001 50.815 75.658 52.313 A 8.876 8.876 0 0 0 75.391 52.49 A 7.285 7.285 0 0 0 72.151 57.719 A 9.599 9.599 0 0 0 72.07 58.984 A 8.304 8.304 0 0 0 72.417 61.442 A 6.506 6.506 0 0 0 74.341 64.429 A 7.71 7.71 0 0 0 77.755 66.164 Q 78.9 66.437 80.24 66.454 A 14.113 14.113 0 0 0 80.42 66.455 A 13.497 13.497 0 0 0 87.036 64.746 Q 90.137 63.037 91.699 60.156 Z M 316.406 60.156 L 316.406 50.195 L 310.01 50.195 A 30.591 30.591 0 0 0 306.561 50.377 Q 302.708 50.815 300.365 52.313 A 8.876 8.876 0 0 0 300.098 52.49 A 7.285 7.285 0 0 0 296.858 57.719 A 9.599 9.599 0 0 0 296.777 58.984 A 8.304 8.304 0 0 0 297.124 61.442 A 6.506 6.506 0 0 0 299.048 64.429 A 7.71 7.71 0 0 0 302.462 66.164 Q 303.607 66.437 304.947 66.454 A 14.113 14.113 0 0 0 305.127 66.455 A 13.497 13.497 0 0 0 311.743 64.746 Q 314.844 63.037 316.406 60.156 Z M 116.368 6.169 A 7.081 7.081 0 0 0 116.016 8.447 A 8.007 8.007 0 0 0 116.026 8.861 A 6.063 6.063 0 0 0 117.749 12.915 A 5.28 5.28 0 0 0 118.586 13.614 Q 119.516 14.241 120.751 14.505 A 9.347 9.347 0 0 0 122.705 14.697 A 11.243 11.243 0 0 0 123.042 14.692 Q 126.021 14.603 127.686 12.915 A 5.917 5.917 0 0 0 129.064 10.749 A 6.738 6.738 0 0 0 129.443 8.447 A 8.12 8.12 0 0 0 129.428 7.943 A 6.141 6.141 0 0 0 127.686 3.906 A 5.408 5.408 0 0 0 127.02 3.325 Q 126.037 2.599 124.705 2.303 A 9.217 9.217 0 0 0 122.705 2.1 A 11.115 11.115 0 0 0 122.393 2.104 Q 121.314 2.134 120.409 2.377 A 5.614 5.614 0 0 0 117.749 3.906 A 6.014 6.014 0 0 0 116.368 6.169 Z" 
                vectorEffect="non-scaling-stroke"
              />
            </g>
          </svg>  
        </div>
        <style jsx>{`
          .loading-back {
            position: fixed;
            left: 0; top: 0;
            width: 100%; 
            height: 100%;
            z-index: 10;
            justify-content: center;
            align-items: center;

            @keyframes write { 
              from {
                stroke-dashoffset: 375;
                fill: rgba(255, 255, 255, .1);
              }
              to {
                stroke-dashoffset: 0;
                fill: rgba(255, 255, 255, .15);
              }
            }

            svg:first-child {
              position: fixed;
              left: 0; top: 0;
              width: 100%;
              height: 100%;

              polygon {
                fill: rgba(0, 0, 0, .2);
              }
            }

            svg:not(first-child) {
              z-index: 11;
              g {
                stroke-dasharray: 375;
                stroke-dashoffset: 375;
                fill: rgba(255, 255, 255, .02);
                animation: write 4s cubic-bezier(0.2, 0.3, 0.8, 0.7) 0s infinite alternate
              }
            }
          }  
        `}</style>
      </>
    );
  }
}

export default Loading;
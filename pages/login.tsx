import '../style/global.scss';
import React, { FormEvent } from 'react';
import anime from 'animejs';
import ResponsiveInputBox from '../components/kainplan/ResponsiveInputBox';
import Router from 'next/router';

interface LoginProps {
}

interface LoginState {
  width: number;
  height: number;
}

class Login extends React.Component<LoginProps, LoginState> {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
    };
  }

  waveSvg: SVGElement;
  wavePath: SVGPathElement;

  componentDidMount() {
    window.onresize = () => this.onResize();
    this.onResize();
    anime({
      targets: this.wavePath,
      d: [
        `M0,96L40,122.7C80,149,160,203,240,192C320,181,400,107,480,117.3C560,128,640,224,720,256C800,288,880,256,960,224C1040,192,1120,160,1200,160C1280,160,1360,192,1400,208L1440,224L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z`,
        `M0,64L40,96C80,128,160,192,240,213.3C320,235,400,213,480,176C560,139,640,85,720,80C800,75,880,117,960,122.7C1040,128,1120,96,1200,80C1280,64,1360,64,1400,64L1440,64L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z`,
        `M0,224L40,229.3C80,235,160,245,240,229.3C320,213,400,171,480,160C560,149,640,171,720,202.7C800,235,880,277,960,293.3C1040,309,1120,299,1200,261.3C1280,224,1360,160,1400,128L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z`,
        `M0,256L40,240C80,224,160,192,240,197.3C320,203,400,245,480,229.3C560,213,640,139,720,144C800,149,880,235,960,234.7C1040,235,1120,149,1200,144C1280,139,1360,213,1400,250.7L1440,288L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z`,
        `M0,128L40,112C80,96,160,64,240,74.7C320,85,400,139,480,165.3C560,192,640,192,720,208C800,224,880,256,960,229.3C1040,203,1120,117,1200,101.3C1280,85,1360,139,1400,165.3L1440,192L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z`,
        `M0,0L40,21.3C80,43,160,85,240,112C320,139,400,149,480,154.7C560,160,640,160,720,138.7C800,117,880,75,960,96C1040,117,1120,203,1200,234.7C1280,267,1360,245,1400,234.7L1440,224L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z`,
        `M0,224L40,234.7C80,245,160,267,240,266.7C320,267,400,245,480,213.3C560,181,640,139,720,122.7C800,107,880,117,960,138.7C1040,160,1120,192,1200,202.7C1280,213,1360,203,1400,197.3L1440,192L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z`,
      ],
      duration: 20000,
      easing: 'easeInOutSine',
      loop: true,
      direction: 'alternate',
      autoplay: true,
    });
  }

  onResize() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  onSubmit(e: FormEvent) {
    e.preventDefault();
  }

  render() {
    return (
      <>
        <main>
        <svg ref={e => this.waveSvg = e} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path 
            ref={e => this.wavePath = e} 
            fill="#622dff" 
            fillOpacity="1" 
            d="M0,96L40,122.7C80,149,160,203,240,192C320,181,400,107,480,117.3C560,128,640,224,720,256C800,288,880,256,960,224C1040,192,1120,160,1200,160C1280,160,1360,192,1400,208L1440,224L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
          ></path>
        </svg>
        <div 
          className="loading-wave-filler"
          style={{
            height: `${this.state.height / 2 - (this.waveSvg ? this.waveSvg.getBoundingClientRect().height/2 : 0)}px`,
          }}
        ></div>
        <form onSubmit={this.onSubmit.bind(this)}>
          <h1>Anmelden</h1>
          <ResponsiveInputBox label="Nutzername" />
          <ResponsiveInputBox label="Passwort" type="password" />
          <input type="submit" value="Bestätigen" />
        </form>
        <footer>
          <a onClick={() => Router.back()}>
            Back
          </a>
          <span>
            design &copy; KainPlan
            <span>jk</span>
          </span>
        </footer>
        </main>
        <style jsx>{`
          main {
            width: 100%;
            height: 100%;

            & > svg {
              position: fixed;
              bottom: 50%;
              transform: translateY(50%);
              left: 0;
              width: 100%;
            }

            .loading-wave-filler {
              background-color: #622dff;
              position: fixed;
              left: 0;
              bottom: 0;
              width: 100%;
            }

            form {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background-color: rgba(255,255,255,.85);
              mix-blend-mode: screen;
              padding: 30px;
              border: 2.5px solid #f2f2f2;
              border-radius: 5px 5px 20% 5px;

              input[type="submit"] {
                border: none;
                margin-top: 1.2em;
                background-image: linear-gradient(to right, rgba(255,255,255,.2) 0%, rgba(255,255,255,.2) 50%, #622dff 50%, #622dff 100%);
                background-size: 200% 100%;
                background-position: 0 0;
                border: 1.5px solid #622dff;
                border-radius: 25px;
                width: 100%;
                font-size: 1em;
                padding: 7.5px 0;
                font-weight: lighter;
                text-transform: uppercase;
                color: #622dff;
                transition: .25s ease;

                &:hover, &:focus {
                  outline: none;
                  cursor: pointer;
                  background-position: 100% 0;
                  color: #fff;
                }
              }
            }

            footer {
              position: fixed;
              width: 100%;
              bottom: 0;
              padding: 5px;
              color: #fff;
              display: flex;
              box-sizing: border-box;
              justify-content: space-between;
              align-items: center;
              font-family: 'Open Sans', sans-serif;

              & > a {
                color: inherit;
                font-family: inherit;
                text-decoration: underline;

                &:hover {
                  cursor: pointer;
                }
              }

              & > span {
                font-family: inherit;

                & > span {
                  font-size: .45em;
                  margin-left: 1px;
                  font-family: monospace;
                }
              }
            }
          }  

          @media only screen and (max-width: 600px) {
            main {
              footer {
                left: 50%;
                transform: translateX(-50%);
                width: 90%;
              }
            }
          }
        `}</style>
      </>
    );
  }
}

export default Login;
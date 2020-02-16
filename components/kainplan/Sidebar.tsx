import React from 'react';
import anime from 'animejs';
import SidebarLink, { SidebarLinkProps } from './SidebarLink';

interface SidebarProps {
  links: SidebarLinkProps[];
  north?: React.ReactNode;
}

interface SidebarState extends SidebarProps {
  visible: boolean;
  block: boolean;
}

class Sidebar extends React.Component<SidebarProps, SidebarState> {
  constructor(props) {
    super(props);
    this.state = {
      links: props.links,
      north: props.north,
      visible: false,
      block: false,
    };
  }

  sidebar: HTMLDivElement;

  show() {
    if (!this.state.block) {
      this.setState({
        visible: true,
        block: true,
      }, () => {
        anime({
          targets: this.sidebar,
          translateX: 0,
          easing: 'spring(1, 100, 17.5, 0)'
        }).finished.then(() => this.setState({ block: false, }));
      });
    }
  }

  hide() {
    if (!this.state.block) {
      this.setState({
        block: true,
      }, () => anime({
        targets: this.sidebar,
        translateX: -this.sidebar.getBoundingClientRect().width,
        easing: 'spring(1, 100, 20, 0)',
      }).finished.then(() => this.setState({ visible: false, block: false, })));
    }
  }

  render() {
    return (
      <>
        <div 
          className="sb-back"
          style={{
            display: this.state.visible ? 'block' : 'none',
          }}
          onClick={() => this.hide()}
        >
          <div 
            ref={e => this.sidebar = e}
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              return true;
            }}
            style={{
              transform: `translateX(-1000px)`,
            }}
          >
            <div>
              <h2>KainPlan</h2>
              <div>
                {this.state.north}
              </div>
            </div>
            {this.state.links.map(l => <SidebarLink {...l} key={l.href} />)}
          </div>
        </div>
        <style jsx>{`
          .sb-back {
            position: fixed;
            top: 0; left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,.25  );
            z-index: 10;

            & > div {
              background-color: #fff;
              width: 25%;
              min-width: 350px;
              height: 100%;
              border-right: 2.5px solid #f2f2f2;
              word-wrap: break-word;

              & > div:first-child {
                min-height: 100px;
                position: relative;
                overflow: hidden;
                box-sizing: border-box;
                border-bottom: 2px solid #f2f2f2;

                & > h2 {
                  margin: 0;
                  font-size: 8em;
                  position: absolute;
                  line-height: .8em;
                  font-weight: bold;
                  color: #fff;
                  background-color: #f2f2f2;
                  box-shadow: inset 0 0 10px #ababab;
                }

                & > div {
                  position: absolute;
                  left: 0; top: 0;
                  width: 100%;
                  height: 100%;
                }
              }
            }
          }

          @media only screen and (max-width: 600px) {
            .sb-back {
              & > div {
                width: 80%;
                min-width: 0;
              }
            }
          }
        `}</style>
      </>
    );
  }
}

export default Sidebar;
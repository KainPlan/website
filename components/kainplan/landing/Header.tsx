import React from 'react';
import TenFingers from '../../tenfingers/TenFingers';
import Link from 'next/link';

interface HeaderProps {
  children?: React.ReactNode;
}

interface HeaderState {
}

class Header extends React.Component<HeaderProps, HeaderState> {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  header: HTMLElement;

  componentDidMount() {
    let prev: number = window.scrollY;
    window.onscroll = () => {
      if (!this.header) return;
      let diff: number = window.scrollY - prev;
      if (diff < 0 || window.scrollY === 0 || window.scrollY + window.innerHeight >= window.document.body.offsetHeight) {
        this.header.style.top = '0px';
      } else {
        this.header.style.top = +this.header.style.top.replace('px', '') - diff + 'px';
      }
      prev = window.scrollY;
    };
  }

  render() {
    return (
      <header ref={e => this.header = e}>
        <Link href="/">
          <h1>
            <TenFingers
              values={['KainPlan']}
            />
          </h1>
        </Link>
        <div>
          {this.props.children}
        </div>
        <style jsx>{`
          header {
            position: fixed;
            top: 0;
            left: 0;
            background-color: #fff;
            z-index: 2;
            display: flex;
            width: 100%;
            height: 5em;
            box-sizing: border-box;
            padding: 5px 25px;
            align-items: center;
            justify-content: space-between;
            align-items: stretch;
            overflow: hidden;
            box-shadow: 0px 2px 4px #cecece;
            transition: .2s ease;

            h1 {
              display: flex;
              align-items: center;
              transition: .2s ease;

              &:hover {
                cursor: pointer;
                opacity: .7;
              }
            }

            div {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
          }
        `}</style>
      </header>     
    );
  }
}

export default Header;
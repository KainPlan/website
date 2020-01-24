import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

import TenFingers from '../tenfingers/TenFingers';

interface HeaderProps {
}

interface HeaderState {
  header: React.RefObject<HTMLElement>;
}

class Header extends React.Component<HeaderProps, HeaderState> {
  constructor(props) {
    super(props);
    this.state = {
      header: React.createRef(),
    };
  }

  componentDidMount() {
    let prev: number = window.scrollY;
    window.onscroll = () => {
      let diff: number = window.scrollY - prev;

      if (diff < 0 || window.scrollY === 0 || window.scrollY + window.innerHeight >= window.document.body.offsetHeight) {
        this.state.header.current.style.top = '0px';
      } else {
        this.state.header.current.style.top = +this.state.header.current.style.top.replace('px', '') - diff + 'px';
      }

      prev = window.scrollY;
    };
  }

  render() {
    return (
      <header ref={this.state.header}>
        <h1>
          <TenFingers
            values={['KainPlan']}
          />
        </h1>
        <div>
          <Link href="/map">
            <a>Los geht's! <i><FontAwesomeIcon icon={faExternalLinkAlt} /></i></a>
          </Link>
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
            align-items: center;
            overflow: hidden;
            box-shadow: 0px 2px 4px #cecece;
            transition: .2s ease;
          
            div {
              display: inline-block;
              min-width: 110px;
              background-size: 200% 100%;
              background-image: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0,0,0,0) 50%, #622dff 50%, #622dff 100%);
              background-position: 0 0;
              transition: .15s ease;
              padding: 5px;
              border-radius: 3px;
              box-sizing: border-box;
            
              &:hover {
                cursor: pointer;
                background-position: 100% 0;
                color: #fff;
                transform: scale(1.1);
              }
            
              &:focus {
                outline: none;
              }
            
              i {
                margin-left: 5px;
              }
            
              a {
                text-decoration: none;
                color: inherit;
              }
            }
          }
        `}</style>
      </header>     
    );
  }
}

export default Header;
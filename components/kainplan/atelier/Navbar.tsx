import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faSave, faFolder, faFolderOpen } from '@fortawesome/free-solid-svg-icons';

interface MapOverview {
  name: string;
  version: string;
}

interface NavbarProps {
  map?: MapOverview;
}

interface NavbarState {
  map: MapOverview;
}

class Navbar extends React.Component<NavbarProps, NavbarState> {
  constructor(props) {
    super(props);
    this.state = {
      map: {
        name: props.name || 'default',
        version: props.version || '0.0.0',
      }
    };
  }

  setMap(map: MapOverview) {
    this.setState({
      map,
    });
  }

  render() {
    return (
      <>
        <div className="navbar-root">
          <Link href="/map">
            <img src="/media/logo.png" title="Zurück" alt="KainPlan Logo" />
          </Link>
          <div>
            <div>
              <div>
                <span>{ this.state.map.name }</span>
                <span>{ this.state.map.version }</span>
              </div>
              <div>
                <i title="Neue Karte [Strg + N]">
                  <FontAwesomeIcon icon={faFileAlt} />
                </i>
                <i title="Karte speichern [Strg + S]">
                  <FontAwesomeIcon icon={faSave} />
                </i>
                <i title="Karte speichern als [Strg + Umschalt + S]">
                  <FontAwesomeIcon icon={faFolder} />
                </i>
                <i title="Karte öffnen [Strg + O]">
                  <FontAwesomeIcon icon={faFolderOpen} />
                </i>
              </div>
            </div>
            <div>

            </div>
          </div>
        </div>
        <style jsx>{`
          .navbar-root {
            width: 100%;
            padding: 5px 10px;
            color: #303841;
            border-bottom: 2.5px solid #f2f2f2;
            box-shadow: 0 .5px 4px #cecece;
            box-sizing: border-box;
            display: flex;
            justify-content: stretch;
            align-items: stretch;

            img {
              height: 40px;
              transition: .2s ease;

              &:hover {
                cursor: pointer;
                opacity: .8;
              }
            }

            & > div {
              flex-grow: 1;
              display: flex;
              justify-content: stretch;
              align-items: center;
              margin-left: 10px;
              border-left: 1.5px solid #f2f2f2;
              padding-left: 10px;

              & > div:first-child {
                display: flex;

                & > div:first-child {
                  padding-right: 10px;
                  border-right: 1.5px solid #f2f2f2;
                  margin-right: 10px;

                  & > span:first-child {
                    font-size: 1.1em;
                    font-weight: bold;
                    margin-right: 5px;
                  }

                  & > span:last-child {
                    font-size: .8em;
                    color: #ababab;
                  }
                }

                & > div:last-child {
                  & > i {
                    font-size: 1.4em;
                    transition: .2s ease;

                    &:not(:last-child) {
                      margin-right: 10px;
                    }

                    &:hover {
                      cursor: pointer;
                      transform: scale(1.1);
                      color: #622dff;
                    }
                  }
                }
              }

              & > div:last-child {
                flex-grow: 1;
                display: flex;
                justify-content: flex-end;
                align-items: center;

                
              }
            }
          }
        `}</style>
      </>
    );
  }
}

export default Navbar;
import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faSave, faFolderOpen, faICursor, faMousePointer, faCircle, faArrowsAlt, faLandmark, faLongArrowAltRight, faEraser, faAngleDoubleUp, faPodcast, faPlus } from '@fortawesome/free-solid-svg-icons';
import DropdownGroup from '../DropdownGroup';
import DropdownItem, { DropdownAction } from '../DropdownItem';

interface MapOverview {
  name: string;
  version: string;
}

interface NavbarProps {
  actionHandler: (action: DropdownAction) => void;
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
            </div>
            <div>
              <DropdownGroup
                actionHandler={this.props.actionHandler}
                items={[
                  { label: 'Karte', children: [
                    { id: 'map-new', label: <span title="Strg + N"><FontAwesomeIcon icon={faFileAlt} /> Neue Karte</span>, },
                    { label: <span><FontAwesomeIcon icon={faSave} /> Karte speichern</span>, children: [
                      { id: 'map-save', label: <span title="Strg + S">Speichern</span>, },
                      { id: 'map-save_as', label: <span title="Strg + Umschalt + S">Speichern als</span>, },
                    ], },
                    { id: 'map-open', label: <span title="Strg + O"><FontAwesomeIcon icon={faFolderOpen} />Karte öffnen</span>, },
                   ], },
                  { label: 'Tools', children: [
                    { id: 'tool-default', label: <span title="d"><FontAwesomeIcon icon={faMousePointer} /> Standard</span>, },
                    { id: 'tool-move', label: <span title="m"><FontAwesomeIcon icon={faArrowsAlt} /> Verschieben</span>, },
                    { label: <span><FontAwesomeIcon icon={faPlus} /> Hinzufügen</span>, children: [
                      { id: 'tool-node', label: <span title="n"><FontAwesomeIcon icon={faCircle} /> Knoten</span> },
                      { id: 'tool-endpoint', label: <span title="p"><FontAwesomeIcon icon={faLandmark} /> Endpunkt</span> },
                      { id: 'tool-beacon', label: <span title="b"><FontAwesomeIcon icon={faPodcast} /> BLE Beacon</span> },
                      { id: 'tool-stairs', label: <span title="s"><FontAwesomeIcon icon={faAngleDoubleUp} /> Stiege</span> },
                    ], },
                    { id: 'tool-edge', label: <span title="e"><FontAwesomeIcon icon={faLongArrowAltRight} /> Verbinden</span> },
                    { id: 'tool-remove', label: <span title="d"><FontAwesomeIcon icon={faEraser} /> Entfernen</span> },
                   ], },
                ]}
              />
            </div>
          </div>
        </div>
        <style jsx>{`
          .navbar-root {
            width: 100%;
            padding: 0 10px;
            color: #303841;
            border-bottom: 2.5px solid #f2f2f2;
            box-shadow: 0 .5px 4px #cecece;
            box-sizing: border-box;
            display: flex;
            justify-content: stretch;
            align-items: stretch;

            img {
              height: 40px;
              margin: 5px 0 5px 0;
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
              align-items: stretch;
              margin-left: 10px;
              border-left: 1.5px solid #f2f2f2;
              padding-left: 10px;

              & > div:first-child {
                display: flex;
                align-items: center;

                & > div:first-child {
                  padding-right: 10px;
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
              }

              & > div:last-child {
                flex-grow: 1;
                display: flex;
                justify-content: flex-end;
                align-items: stretch;
              }
            }
          }
        `}</style>
      </>
    );
  }
}

export default Navbar;
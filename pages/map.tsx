import React from 'react';
import MapComponent from '../components/kainplan/Map';
import fetch from 'isomorphic-unfetch';
import KPMap from '../lib/models/KPMap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMapMarkerAlt, faBars, faSearch, faRoute, faChevronDown, faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons';

import '../style/map.scss';

interface MapProps {
  map: KPMap;
};

interface MapState {
  map: KPMap;
};

class Map extends React.Component<MapProps, MapState> {
  static getInitialProps = async function () {
    if (process.env.NODE_ENV === 'development') process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const res = await fetch('https://localhost:42069/map');
    const data = await res.json();

    return {
      map: data.map,
    };
  };

  private nav: {
    from: {
      _: HTMLDivElement,
      input: HTMLInputElement,
    },
    to: {
      input: HTMLInputElement,
    },
    results: HTMLDivElement,
  } = {
    from: {
      _: null,
      input: null,
    },
    to: {
      input: null,
    },
    results: null,
  };
  private sidebar: HTMLDivElement;

  constructor(props) {
    super(props);
    this.state = {
      map: props.map,
    };
  }

  componentDidMount() {
    if (!this.state.map) window.location.assign('/');
    console.log(this.state.map);
  }

  onCloseNavFrom() {
  }

  onClearFromIn() {
  }

  onSelectStartPoint() {
  }

  onOpenSidebar() {
  }

  onClearToIn() {
  }

  onSearch() {
  }

  onShowRoute() {
  }

  onClosePointContainer() {
  }

  onCloseSidebar() {
  }

  render() {
    return (
      <>
        <MapComponent fullscreen map={this.state.map}>
          <div className="overlays">
            <div className="nav-container">
              <div id="nav-from" ref={nf => this.nav.from._ = nf}>
                <i onClick={this.onCloseNavFrom.bind(this)}><FontAwesomeIcon icon={faTimes} title="Schließen" /></i>
                <div className="labelled-input">
                  <input ref={i => this.nav.from.input = i} id="from-in" type="text" autoComplete="off" spellCheck="false" />
                  <label>Wo befinden Sie sich?</label>
                  <button onClick={this.onClearFromIn.bind(this)} id="clear-from-in" className="clear-input"><i className="far fa-trash-alt"></i></button>
                </div>
                <i onClick={this.onSelectStartPoint.bind(this)}><FontAwesomeIcon icon={faMapMarkerAlt} title="Startpunkt auswählen" /></i>
              </div>
              <div className="nav">
                <i onClick={this.onOpenSidebar.bind(this)}><FontAwesomeIcon icon={faBars} title="Navigationsleiste öffnen" /></i>
                <div className="labelled-input">
                  <input ref={i => this.nav.to.input = i} id="search-in" type="text" autoComplete="none" spellCheck="false" />
                  <label>Was suchen Sie?</label>
                  <button onClick={this.onClearToIn.bind(this)} id="clear-search-in" className="clear-input"><i className="far fa-trash-alt"></i></button>
                </div>
                <i onClick={this.onSearch.bind(this)}><FontAwesomeIcon icon={faSearch} title="Suchen" /></i>
              </div>
              <div ref={d => this.nav.results = d} id="nav-results">
              </div>
            </div>
            <div id="point-container">
              <div id="point-img"></div>
              <div className="point-info">
                <div className="point-head-container">
                  <div>
                    <h3 id="point-title">Unbekannt</h3>
                    <p id="point-floor">Erdgeschoss</p>
                  </div>
                  <i onClick={this.onShowRoute.bind(this)}><FontAwesomeIcon icon={faRoute} title="Route anzeigen"/></i>
                </div>
                <p id="point-desc">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
                <i onClick={this.onClosePointContainer.bind(this)} id="close-point-container"><FontAwesomeIcon icon={faChevronDown} title="Schließen"/></i>
              </div>
            </div>
            <div className="bottom-controls-container">
              <div id="point-container-mb">
                <div className="point-info-mb">
                  <h3 id="point-title-mb">Unbekannt</h3>
                  <p id="point-floor-mb">Erdgeschoss</p>
                </div>
                <i onClick={this.onShowRoute.bind(this)} id="route-mb"><FontAwesomeIcon icon={faRoute} title="Route anzeigen" /></i>
              </div>
              <div id="floors-container">
                <i></i>
                <i className="current"></i>
              </div>
            </div>
            <div id="sb-back">
              <div id="loading">
                <div className="loading-anim"></div>
                <span>Lädt ...</span>
              </div>
            </div>
            <div id="sidebar" ref={sb => this.sidebar = sb}>
              <i onClick={this.onCloseSidebar.bind(this)}><FontAwesomeIcon icon={faAngleDoubleLeft} title="Schließen" /></i>
            </div>
          </div>
          <style jsx>{`
            .labelled-input {
              flex-grow: 1;
              position: relative;
              display: flex; 
              align-items: center;
                
              input {
                width: 100%;
                border: none;
                padding: 5px;
                font-size: 1.1em;
                color: #444;
                margin-top: 15px;
                font-family: 'Roboto', sans-serif;
                box-sizing: border-box;
              
                &:focus {
                  outline: none;
                }
                
                &:focus ~ label {
                  font-size: .8em;
                  transform: translateY(-19px);
                }
              
                &::selection {
                  background-color: rgba(98, 45, 255, .7);
                  color: #fff;
                }
              }
            
              .label-top {
                font-size: .8em;
                transform: translateY(-19px);
              }
            
              label {
                position: absolute;
                bottom: .8em; left: 14.5px;
                pointer-events: none;
                transition: .3s ease;
              }
            
              .clear-input {
                background: none;
                border: none;
                font-size: 1em;
                font-weight: normal;
                color: #444;
                transition: .2s ease;
          
                &:hover {
                  color: #f44;
                  cursor: pointer;
                }
              }
            }

            .nav-container {
              position: fixed;
              left: 25px; top: 25px;
              z-index: 3;
              background-color: #fff;
              border: 1.75px solid #f2f2f2;
              border-radius: 4px;
              box-shadow: 1px 1px 5px #f2f2f2;
                
              .nav, #nav-from {
                  display: flex;
                  justify-content: stretch;
                  align-items: stretch;
                  user-select: none;
                  border-bottom: 1.5px solid #f2f2f2;
              
                  & > * {
                      padding: 0 10px;
                      border-right: 1.5px solid #fafafa;
                      color: #444;
                  }
                
                  *:last-child {
                      border: none;
                  }
                
                  & > i {
                      transition: .3s ease;
                      display: flex;
                      align-items: center;
                      width: 15px;
                  
                      &:hover {
                          cursor: pointer;
                          color: #622dff;
                      }
                  }
              }
            
              #nav-from {
                  display: none;
              }
            
              #nav-results {
                max-width: 325px;
                max-height: 0;
                overflow: hidden;
            
                .nav-res {
                  color: #444;
                  padding: 5px 15px;
                  border-bottom: 1.4px solid #f2f2f2;
              
                  h3 {
                    margin: 0;
                    font-size: 1em;
                    transition: .3s ease;
                    font-weight: bold;
                    
                    .match {
                      text-decoration: underline;
                    }
                  }
                
                  p {
                    margin: 0;
                    font-size: .8em;
                  }
                
                  &:last-child {
                    border-bottom: none;
                  }
                
                  &:hover {
                    cursor: pointer;
                  }
                
                  &:hover > h3 {
                    color: #622dff;
                  }
                }
              }
            }

            #point-container {
              position: absolute;
              top: 0; left: 0;
              width: 375px;
              height: 100%;
              background-color: #fff;
              box-shadow: 1px 1px 5px #f2f2f2;
              border-right: 2px solid #f2f2f2;
              display: none;
              flex-direction: column;
              justify-content: stretch;
                
              #point-img {
                width: 100%;
                height: 200px;
                background-image: url(/media/logo.png);
                background-position: center;
                border-bottom: 1.5px solid #f2f2f2;
              }
            
              .point-info {
                position: relative;
                flex-grow: 1;
                padding: 0 15px;
                z-index: 2;
                background-color: #fff;
            
                .point-head-container {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding: 15px 0;
                  border-bottom: 1.5px solid #f2f2f2;
              
                  div {
                    #point-title {
                      font-size: 1.7em;
                      margin: 0;
                    }
                  
                    #point-floor {
                      margin: 0;
                      font-size: 1em;
                    }
                  }
                
                  #route {
                    color: #fff;
                    background-color: #622dff;
                    font-size: 2em;
                    padding: 10px;
                    border-radius: 50%;
                    transition: .3s ease;
                
                    &:hover {
                      cursor: pointer;
                      transform: rotate(360deg) scale(1.1);
                      box-shadow: 0 0 5px #f2f2f2;
                    }
                  }
                }
              
                #close-point-container {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  position: absolute;
                  right: 20px; bottom: 20px;
                  font-size: 1.6em;
                  padding: 10px;
                  width: 25px; height: 25px;
                  border-radius: 50%;
                  box-shadow: 0px 0px 5px #f2f2f2;
                  border: 1.5px solid #f2f2f2;
                  transition: .3s ease;
              
                  &:hover {
                    cursor: pointer;
                    transform: rotate(360deg) scale(1.1);
                  }
                }
              }
            }

            .bottom-controls-container {
              position: absolute;
              bottom: 0; left: 0; right: 0;
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: bottom;
                
              #point-container-mb {
                width: 375px;
                display: none;
                justify-content: stretch;
                align-items: center;
                background-color: #fff;
                padding: 20px;
                border-radius: 0 15px 0 0;
                box-shadow: 0 0 5px #f2f2f2;
                box-sizing: border-box;
            
                .point-info-mb {
                  flex-grow: 1;
                  display: flex;
                  justify-content: flex-start;
                  align-items: baseline;
              
                  #point-title-mb {
                    font-size: 1.3em;
                    margin: 0;
                    margin-right: 5px;
                  }
                
                  #point-floor-mb {
                    font-size: .8em;
                    margin: 0;
                  }
                }
              
                #route-mb {
                  color: #fff;
                  background-color: #622dff;
                  font-size: 2em;
                  padding: 10px;
                  border-radius: 50%;
                  transition: .3s ease;
              
                  &:hover {
                    cursor: pointer;
                    transform: rotate(360deg) scale(1.1);
                    box-shadow: 0 0 5px #f2f2f2;
                  }
                }
              
                &:hover {
                  cursor: pointer;
                }
              }
            
              #floors-container {
                margin-left: auto;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                align-items: center;
                padding: 15px;
            
                i {
                  background-color: #fff;
                  border: 2.4px solid #444;
                  color: #444;
                  border-radius: 50%;
                  width: 1.2em; height: 1.2em;
                  margin-bottom: 5px;
                  transition: .3s ease;
              
                  &:last-child {
                    margin: 0;
                  }
                
                  &.current {
                    border-color: #622dff;
                    background-color: rgb(248, 246, 255);
                  }
                
                  &:not(.current):hover {
                    cursor: pointer;
                    border-color: #7a4eff;
                    transform: scale(1.1);
                  }
                }
              }
            }

            #sb-back {
              position: absolute;
              left: 0; top: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0,0,0,.25);
              z-index: 10;
              display: none;
              justify-content: center;
              align-items: center;
                
              #loading {
                display: none;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
            
                @keyframes rect-rotate {
                  0% {
                    transform: rotate(0); 
                  }
                  50%, 100% {
                    transform: rotate(180deg); 
                  } 
                }
                
                @keyframes fill-rect {
                  0%, 50% {
                    height: 0;
                  }
                  100% {
                    height: inherit;
                  } 
                }
              
                .loading-anim {
                  z-index: 3;
                  color: #fff;
                  height: 48px;
                  width: 48px;
                  position: relative;
                  border: 4px solid;
                  display: inline-block;
                  animation: rect-rotate 1s linear infinite;
              
                  &::after {
                    content: '';
                    height: 0;
                    width: inherit;
                    display: block;
                    background: rgba(255,255,255,.5);
                    animation: fill-rect 1s linear infinite;
                  }
                }
              
                span {
                  margin-top: 15px;
                  color: #fff;
                }
              }
            }

            #sidebar {
              position: absolute;
              height: 100%;
              top: 0; left: 0;
              z-index: 11;
              background-color: #fff;
              border-right: 2.5px solid #f2f2f2;
              width: 400px;
              display: none;
                
              #close-sidebar {
                position: absolute;
                right: -30px;
                bottom: 15px;
                z-index: 11;
                padding: 5px;
                border: 2.5px solid #f2f2f2;
                border-left: none;
                background-color: #fff;
                font-size: 1.4em;
                color: #444;
                transition: .3s ease;
            
                &:hover {
                  cursor: pointer;
                  color: #f44;
                }
              }
            
              .sb-login {
                width: 100%;
                min-height: 100px;
                position: relative;
                overflow: hidden;
                box-sizing: border-box;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                border-bottom: 2px solid #f2f2f2;
            
                .sb-title {
                  width: 100%;
                  font-size: 10em;
                  position: absolute;
                  margin: 0;
                  left: 0;
                  color: #fff;
                  z-index: 0;
                  background-color: #f2f2f2;
                }
              
                .sb-login-back {
                  position: relative;
                  width: 100%;
                  min-height: 100px;
                  display: flex;
                  justify-content: flex-end;
                  align-items: center;
                  background: linear-gradient(to right, rgba(0,0,0,0), rgba(255,255,255,1));
                  z-index: 1;
              
                  #login {
                    display: inline-block;
                    padding: 5px;
                    border-radius: 3.5px;
                    color: #fff;
                    margin: 10px;
                    margin-right: 15px;
                    font-size: 1.1em;
                    border: 2px solid #622dff;
                    color: #622dff;
                    background: linear-gradient(to right, #fff 0%, #fff 50%, #622dff 50%, #622dff 100%);
                    background-size: 200% 100%;
                    background-position: 0 0;
                    transition: .3s ease;
                
                    &:hover {
                      cursor: pointer;
                      background-position: 100% 0;
                      color: #fff;
                    }
                  }
                
                  .sb-uname {
                    font-family: 'Open Sans', sans-serif;
                    padding: 10px;
                  }
                }
              }
            
              .sb-items {
                .sb-item {
                  padding: 10px;
                  display: flex;
                  justify-content: space-between;
                  color: #444;
                  border-bottom: 1.5px solid #f2f2f2;
                  text-decoration: none;
                  transition: .3s ease;
              
                  &:hover {
                    color: #622dff;
                  }
                
                  span {
                    position: relative;
                  }
                
                  span:after {
                    content: "";
                    position: absolute;
                    z-index: -1;
                    right: 0;
                    width: 0;
                    bottom: -2px;
                    background: #622dff;
                    height: 2px;
                    transition: .3s ease;
                  }
                
                  &:hover > span:after {
                    left: 0;
                    width: 100%;
                  }
                }
              }
            }

            @media only screen and (max-width: 600px) {
              .nav-container {
                right: 25px;
            
                .nav {
                  justify-content: stretch !important;
                }
              
                .nav-results {
                  max-width: 100% !important;
                }
              }
            
              #point-container {
                width: 100% !important;
              }
            
              .bottom-controls-container {
                flex-direction: column-reverse;
                justify-content: space-between;
                align-items: flex-end;
            
                #point-container-mb {
                  border-radius: 0 !important;
                  width: 100% !important;
                }
              }
            
              #sidebar {
                max-width: 85% !important;
                width: 85% !important;
              }
            }
          `}</style>
        </MapComponent>
      </>
    );
  }
}

export default Map;
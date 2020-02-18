import '../style/global.scss';
import React from 'react';
import Head from 'next/head';
import MapComponent from '../components/kainplan/Map';
import withAuth, { AuthProps } from '../middleware/auth';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import SelectPopup from '../components/kainplan/SelectPopup';
import TimeFormatter from '../lib/models/TimeFormatter';
import { withCookies, Cookies } from 'react-cookie';
import { Cookie } from 'universal-cookie';
import Loading from '../components/kainplan/Loading';
import { SelectItem } from '../components/kainplan/Select';
import Navbar from '../components/kainplan/atelier/Navbar';
import { DropdownAction } from '../components/kainplan/DropdownItem';

if (process.env.NODE_ENV === 'development') process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

interface MapInfo {
  name: string;
  timestamp: number;
}

interface MapSelectItem extends SelectItem {
  mapInfo: MapInfo;
}

interface AtelierProps extends AuthProps {
  cookies: Cookies;
  allCookies: Cookie[];
}

interface AtelierState {
  availableMaps: MapInfo[];
}

class Atelier extends React.Component<AtelierProps, AtelierState> {
  constructor(props) {
    super(props);
    this.state = {
      availableMaps: [],
    };
  }

  navContainer: HTMLElement;
  nav: Navbar;
  map: MapComponent;
  loading: Loading;
  openPopup: SelectPopup;

  navbarEventMap = {
    "map": {
      "new": this.showNewMap.bind(this),
      "save": this.showSaveMap.bind(this),
      "save_as": this.showSaveMapAs.bind(this),
      "open": this.showOpenMap.bind(this),
    },
    "tool": {

    },
  };

  componentDidMount() {
    this.loadAvailableMaps(() => this.openPopup.show());
    window.document.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('resize', this.onResize.bind(this));
    this.onResize();
  }

  async loadAvailableMaps(cb?: () => void) {
    this.loading.show();

    fetch(`https://localhost:42069/maps/${this.props.cookies.get('tkn')}`)
      .then(res => res.json())
      .then(res => {
        if (!res.success) return;
        this.setState({
          availableMaps: res.maps,
        }, () => {
          this.loading.hide();
          this.openPopup.setChildren(this.state.availableMaps.map(m => {
            return {
              info: <div style={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{
                  fontWeight: 'bold',
                }}>
                  { m.name }
                </span>
                <span style={{
                  fontSize: '.9em',
                  color: '#999',
                }}>
                  { TimeFormatter.getTimeDiff(new Date(m.timestamp), new Date()) }
                </span>
              </div>,
              mapInfo: m,
            };
          }));
          if (cb) cb();
        });
      });
  }

  showLoading(start: boolean) {
    if (start) return this.loading.show();
    this.loading.hide();
  }

  onKeyDown(e: KeyboardEvent) {    
    if (e.keyCode === 79 && e.ctrlKey) { // ctrl + o
      e.preventDefault();
      this.showOpenMap();
    } else if (e.keyCode === 78 && e.ctrlKey) { // ctrl + n
      e.preventDefault();
      this.showNewMap();
    } else if (e.keyCode === 83 && e.shiftKey && e.ctrlKey) { // ctrl + shift + s
      e.preventDefault();
      this.showSaveMapAs();
    } else if (e.keyCode === 83 && e.ctrlKey) { // ctrl + s
      e.preventDefault();
      this.showSaveMap();
    }
  }

  onResize() {
    if (!this.navContainer || !this.map) return;
    this.map.resize(window.innerWidth, window.innerHeight-this.navContainer.getBoundingClientRect().height);
  }

  onNavbarAction(action: DropdownAction) {
    let parts: string[] = action.id.split("-");
    let cu: any = this.navbarEventMap;
    for (let i = 0; i < parts.length; i++) cu = cu[parts[i]];
    (cu as ()=>void)();
  }

  showOpenMap() {
    if (!this.openPopup) return;
    if (!this.openPopup.popup.state.visible) {
      this.openPopup.setCloseable(true);
      this.openPopup.show();
    }
  }

  onOpenMap(si: MapSelectItem) {
    this.map.loadMap(si.mapInfo.name, this.props.cookies.get('tkn'), () => {
      this.nav.setMap({ name: si.mapInfo.name, version: this.map.state.map.version, });
    });
  }

  showNewMap() {
  }

  onNewMap() {
  }

  showSaveMapAs() {
  }

  onSaveMapAs() {
  }

  showSaveMap() {
  }

  onSaveMap() {
  }

  render() {
    return (
      <>
        <Head>
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
          />
          <title>
            KainPlan ; Atelier
          </title>
        </Head>
        <nav ref={e => this.navContainer = e}>
          <Navbar
            ref={e => this.nav = e}
            actionHandler={this.onNavbarAction.bind(this)} 
          />
        </nav>
        <MapComponent 
          loadingFn={this.showLoading.bind(this)}
          ref={e => this.map = e}>
          <Loading 
            ref={e => this.loading = e} 
          />
          <SelectPopup
            ref={e => this.openPopup = e} 
            title="Öffnen"
            onSubmit={this.onOpenMap.bind(this)}
            icon={faFolderOpen}
            unCloseable
          >{[
          ]}</SelectPopup>
        </MapComponent>
        <style jsx global>{`
          html, body, #__next {
            width: 100%;
            height: 100%;
            overflow: hidden;
          }  
        `}</style>
      </>
    );
  }
}

export default withAuth(withCookies(Atelier), true, true);
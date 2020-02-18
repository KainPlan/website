import '../style/global.scss';
import React from 'react';
import Head from 'next/head';
import MapComponent from '../components/kainplan/Map';
import withAuth, { AuthProps } from '../middleware/auth';
import { faFolderOpen, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import SelectPopup from '../components/kainplan/SelectPopup';
import TimeFormatter from '../lib/models/TimeFormatter';
import { withCookies, Cookies } from 'react-cookie';
import { Cookie } from 'universal-cookie';
import Loading from '../components/kainplan/Loading';
import { SelectItem } from '../components/kainplan/Select';
import Navbar from '../components/kainplan/atelier/Navbar';
import { DropdownAction } from '../components/kainplan/DropdownItem';
import Popup from '../components/kainplan/Popup';
import ImageUpload from '../components/kainplan/ImageUpload';
import ResponsiveInputBox from '../components/kainplan/ResponsiveInputBox';
import BeautifulButton from '../components/kainplan/BeautifulButton';
import ToastHandler from '../components/kainplan/ToastHandler';
import { ToastPosition } from '../components/kainplan/Toast';

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
  ready?: boolean;
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
  newPopup: Popup;
  newMapName: ResponsiveInputBox;
  newMapVersion: ResponsiveInputBox;
  newMapImage: ImageUpload;
  openPopup: SelectPopup;
  toaster: ToastHandler;

  navbarEventMap = {
    "map": {
      "new": this.showNewMap.bind(this),
      "save": this.onSaveMap.bind(this),
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

  loadAvailableMaps(cb?: () => void) {
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
    if (!this.state.ready) return;
    if (e.keyCode === 79 && e.ctrlKey) { // ctrl + o
      e.preventDefault();
      this.showOpenMap();
    } else if (e.keyCode === 75 && e.ctrlKey) { // ctrl + k
      e.preventDefault();
      this.showNewMap();
    } else if (e.keyCode === 83 && e.shiftKey && e.ctrlKey) { // ctrl + shift + s
      e.preventDefault();
      this.showSaveMapAs();
    } else if (e.keyCode === 83 && e.ctrlKey) { // ctrl + s
      e.preventDefault();
      this.onSaveMap();
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
      this.loadAvailableMaps(() => {
        this.openPopup.setCloseable(true);
        this.openPopup.show();
      });
    }
  }

  onOpenMap(si: MapSelectItem) {
    if (!this.map) return;
    this.map.loadMap(si.mapInfo.name, this.props.cookies.get('tkn'), () => {
      this.nav.setMap({ name: si.mapInfo.name, version: this.map.state.map.version, });
      this.setState({
        ready: true,
      });
    });
  }

  showNewMap() {
    if (!this.newPopup) return;
    if (!this.newPopup.state.visible) {
      this.newPopup.show();
    }
  }

  onNewMap(e: React.FormEvent) {
    e.preventDefault();
    let name: string = this.newMapName.state.content.trim();
    let version: string = this.newMapVersion.state.content.trim();
    let image: File = this.newMapImage.state.file;
    if (name === '' || version === '' || typeof image !== 'object') {
      this.newPopup.wiggle();
      this.toaster.showError('Bitte alles ausfüllen!', 3);
    }
  }

  showSaveMapAs() {
  }

  onSaveMapAs() {
  }

  onSaveMap() {
    if (!this.map) return;
    this.map.saveMap(this.map.state.name, this.props.cookies.get('tkn'), null, () => {
      this.nav.setMap({ name: this.map.state.name, version: this.map.state.map.version, });
    });
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
          adminMode
          loadingFn={this.showLoading.bind(this)}
          ref={e => this.map = e}
        >
          <Loading 
            ref={e => this.loading = e} 
          />
          <Popup 
            ref={e => this.newPopup = e}
            title="Neu" 
            icon={faFileAlt}
          >
            <form 
              style={{
                padding: '0 25px',
              }}
              onSubmit={this.onNewMap.bind(this)}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <ResponsiveInputBox ref={e => this.newMapName = e} label="Kartenname" />
                  <ResponsiveInputBox ref={e => this.newMapVersion = e} label="Ausgangsversion" />
                </div>
                <div style={{
                  flexGrow: 1,
                  height: '200px',
                }}>
                  <ImageUpload ref={e => this.newMapImage = e} label="Kartenhintergrund" />
                </div>
              </div>
              <div style={{
                marginTop: '25px',
                display: 'flex',
                justifyContent: 'flex-end',
              }}>
                <BeautifulButton
                  type="submit"
                  label="Erstellen"
                />
              </div>
            </form>
          </Popup>
          <SelectPopup
            ref={e => this.openPopup = e} 
            title="Öffnen"
            onSubmit={this.onOpenMap.bind(this)}
            icon={faFolderOpen}
            unCloseable
          >{[]}</SelectPopup>
          <ToastHandler 
            position={ToastPosition.BOTTOM_RIGHT}
            ref={e => this.toaster = e}
          />
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
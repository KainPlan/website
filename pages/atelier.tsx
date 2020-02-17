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

  map: MapComponent;
  loading: Loading;
  openPopup: SelectPopup;

  componentDidMount() {
    this.loadAvailableMaps(() => this.openPopup.show());
    window.addEventListener('keyup', this.onKeyUp.bind(this));
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

  openMap(name: string) {
    this.map.loadMap(name, this.props.cookies.get('tkn'));
  }

  onKeyUp(e: KeyboardEvent) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if (e.keyCode === 79 && e.ctrlKey) {
      this.openPopup.setCloseable(true);
      this.openPopup.show();
    }

    return false;
  }

  render() {
    return (
      <>
        <Head>
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
          />
          <title>
            KainPlan ; Atelier
          </title>
        </Head>
        <MapComponent 
          fullscreen
          loadingFn={this.showLoading.bind(this)}
          ref={e => this.map = e}>
          <Loading 
            ref={e => this.loading = e} 
          />
          <SelectPopup
            ref={e => this.openPopup = e} 
            title="Öffnen"
            onSubmit={si => this.openMap((si as MapSelectItem).mapInfo.name)}
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
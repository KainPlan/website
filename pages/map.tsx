import '../style/global.scss';
import React from 'react';
import Head from 'next/head';
import MapComponent from '../components/kainplan/Map';
import fetch from 'isomorphic-unfetch';
import KPMap from '../lib/models/KPMap';
import { faBars, faSearch, faHome, faTimes, faMapMarkerAlt, faDraftingCompass } from '@fortawesome/free-solid-svg-icons';
import SearchBox from '../components/kainplan/SearchBox';
import Sidebar from '../components/kainplan/Sidebar';
import Link from 'next/link';
import { faReact } from '@fortawesome/free-brands-svg-icons';
import Loading from '../components/kainplan/Loading';
import withAuth, { AuthProps } from '../middleware/auth';

interface MapProps extends AuthProps {
};

interface MapState {
  map: KPMap;
};

class Map extends React.Component<MapProps, MapState> {
  constructor(props) {
    super(props);
    this.state = {
      map: null,
    };
  }

  componentDidMount() {
    this.loadMap();
    console.log(this.props);
  }

  map: MapComponent;
  toSearch: SearchBox;
  fromSearch: SearchBox;
  loading: Loading;
  sidebar: Sidebar;

  async loadMap() {
    this.showLoading();
    if (process.env.NODE_ENV === 'development') process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const res = await fetch('https://localhost:42069/map');
    const data = await res.text();

    this.setState({
      map: JSON.parse(data).map,
    }, async () => window.setTimeout(() => {
      this.map.provideMap(this.state.map);
      this.showLoading(false);
    }, 500));
  }

  onCloseNavFrom() {
  }

  onSelectStartPoint() {
  }

  onOpenSidebar() {
    this.sidebar.show();
  }

  onCloseSidebar() {
    this.sidebar.hide();
  }

  onSearch() {
  }

  onShowRoute() {
  }

  onClosePointContainer() {
  }

  onSwitchFloor(fid: number) {
  }

  showLoading(start: boolean = true) {
    if (start) this.loading.show();
    else this.loading.hide();
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
            KainPlan ; Karte
          </title>
        </Head>
        <MapComponent
          fullscreen
          ref={e => this.map = e}
          loadingFn={this.showLoading.bind(this)}
        >
          <div className="overlays">
            <div className="nav-container">
              <div>
                <SearchBox
                  ref={e => this.fromSearch = e}
                  westIcon={faTimes}
                  eastIcon={faMapMarkerAlt}
                  label="Wo befinden Sie sich?"
                />
              </div>
              <div>
                <SearchBox
                  ref={e => this.toSearch = e}
                  westIcon={faBars} 
                  eastIcon={faSearch}
                  label={[
                    "Wonach suchen Sie?",
                    "z.B.: Eingang",
                    "z.B.: 3DHIF",
                    "z.B.: Turnsaal",
                    "z.B.: Direktion",
                    "z.B.: Direktion ...",
                  ]}
                  onWestClick={this.onOpenSidebar.bind(this)}
                  onEastClick={() => this.toSearch.focus()}
                />
              </div>
            </div>
            <Loading ref={e => this.loading = e} />
            <Sidebar
              ref={e => this.sidebar = e}
              links={[
                { icon: faHome, title: 'Home', href: '/', },
                ... this.props.user.isAdmin ? [{ icon: faDraftingCompass, title: 'Atelier', href: '/atelier', }] : [],
              ]}
              north={
                <Link href={ this.props.loggedIn ? '/dashboard' : '/login' }>
                  <a style={{
                    textDecoration: 'none',
                    color: '#fff',
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: '#622dff',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    boxShadow: '.5px 1px 3px #cacaca',
                  }}>{ this.props.loggedIn ? this.props.user.username : 'Login' }</a>
                </Link>
              }
            />
          </div>
        </MapComponent>
        <style jsx global>{`
          html, body, #__next {
            padding: 0;
            margin: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }

          .overlays {
            .nav-container {
              position: fixed;
              top: 25px;
              left: 25px;
              background-color: #fff;
              box-shadow: .5px 1px 3px #dadada;

              & > div {
                border: 1.5px solid #f2f2f2;
              }
            }
          }
        `}</style>
      </>
    );
  }
}

export default withAuth(Map);
import React from 'react';
import MapComponent from '../components/kainplan/Map';
import fetch from 'isomorphic-unfetch';
import KPMap from '../models/KPMap';

import '../style/map.scss';

interface MapProps {
  map: KPMap;
};

interface MapState {
  map: KPMap;
};

class Map extends React.Component<MapProps, MapState> {
  static getInitialProps = async function() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const res = await fetch('https://localhost:42069/map');
    const data = await res.json();
  
    if (!data.success) {
      window.location.assign('/');
    } else {
      return {
        map: data.map,
      };
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      map: props.map,
    };
  }

  render() {
    return (
      <>
        <MapComponent fullscreen map={this.state.map}>
          <div>
            Hello World!
          </div>
          <style jsx>{`
            div {
              position: absolute;
              top: 25px; left: 25px;
              background-color: #fff;
              padding: 15px;
              border-radius: 3px;
              box-shadow: 1px 1px 2.5px #ccc;
            }
          `}</style>
        </MapComponent>
      </>
    );
  }
}

export default Map;
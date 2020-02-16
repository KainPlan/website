import '../style/global.scss';
import React from 'react';
import Head from 'next/head';
import MapComponent from '../components/kainplan/Map';
import withAuth, { AuthProps } from '../middleware/auth';
import Popup from '../components/kainplan/Popup';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';

interface AtelierProps extends AuthProps {
}

interface AtelierState {
}

class Atelier extends React.Component<AtelierProps, AtelierState> {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  map: MapComponent;
  openPopup: Popup;

  componentDidMount() {
    this.openPopup.show();
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
          ref={e => this.map = e}>
          <Popup
            ref={e => this.openPopup = e} 
            title="Öffnen"
            icon={faFolderOpen}
          >
            asdf
          </Popup>
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

export default withAuth(Atelier, true, true);
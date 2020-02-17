import '../style/global.scss';
import React from 'react';
import Footer from '../components/kainplan/landing/Footer';
import Header from '../components/kainplan/landing/Header';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import HypedLink from '../components/kainplan/HypedLink';

class Team extends React.Component {
  render() {
    return (
      <>
        <Header>
          <HypedLink
            label="Los geht's!"
            href="/map"
            icon={faExternalLinkAlt}
          />
        </Header>
        <article>
          <h2>Team</h2>
          <div>Lorem Ipsum dolor sit amet, ...</div>
          <div>
            <img src="https://bit.ly/37y2Cfe" />
            <img src="https://bit.ly/37y2Cfe" />
            <img src="https://bit.ly/37y2Cfe" />
          </div>
          <div>
            <img src="https://bit.ly/37y2Cfe" />
          </div>
          <div>
            <img src="https://bit.ly/37y2Cfe" />
            <img src="https://bit.ly/37y2Cfe" />
            <img src="https://bit.ly/37y2Cfe" />
          </div>
          <div>Lorem Ipsum dolor sit amet, ...</div>
        </article>
        <Footer></Footer>
        <style jsx>{`
          article {
            padding-top: 5em;
            text-align: center;

            img {
              margin: 15px;
              width: 250px;
            }
          }
        `}</style>
      </>
    );
  }
}

export default Team;
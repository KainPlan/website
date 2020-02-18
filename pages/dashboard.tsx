import React from 'react';
import '../style/global.scss';
import withAuth, { AuthProps } from '../middleware/auth';
import WaveBackground, { WaveBackgroundPosition } from '../components/kainplan/WaveBackground';
import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserSecret, faHome, faMap, faDraftingCompass, faSync } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

interface DashboardProps extends AuthProps {
}

interface DashboardState {
}

class Dashboard extends React.Component<DashboardProps, DashboardState> {
  render() {
    return (
      <>
        <Head>
          <title>KainPlan ; Dashboard [{this.props.user.username}]</title>
        </Head>
        <main>
          <WaveBackground position={WaveBackgroundPosition.TOP} background="#303841" />
          <nav>
            <Link href="/dashboard">
              <div>
                <i>
                  <FontAwesomeIcon icon={faUserSecret} />
                </i>
                <span>{this.props.user.username}</span>
              </div>
            </Link>
            <Link href="/">
              <div>
                <i>
                  <FontAwesomeIcon icon={faHome} />
                </i>
                Home
              </div>
            </Link>
            <Link href="/map">
              <div>
                <i>
                  <FontAwesomeIcon icon={faMap} />
                </i>
                Karte
              </div>
            </Link>
            { 
              this.props.user.isAdmin && 
              <Link href="/atelier">
                <div>
                  <i>
                    <FontAwesomeIcon icon={faDraftingCompass} />
                  </i>
                  Atelier
                </div>
              </Link> || ''
            }
            <Link href="/login">
              <div>
                <i>
                  <FontAwesomeIcon icon={faSync} />
                </i>
                Nutzer wechseln
              </div>
            </Link>
          </nav>
          <article>
          </article>
        </main>
        <style jsx global>{`
          html, body, #__next {
            width: 100%;
            height: 100%;
          }

          main {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: stretch;
            align-items: stretch;

            & > nav {
              display: flex;
              flex-direction: column;
              justify-content: stretch;
              align-items: stretch;
              background-color: #1E2329;
              color: #E5E6E7;
              box-shadow: .5px 0 4px #333;
              width: 5%;
              min-width: 150px;

              & > div:first-child { /* user div */
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 15px;
                margin-bottom: 7.5px;
                border-bottom: 1.5px solid #303841;
                transition: .2s ease;

                & > i {
                  background-color: #E5E6E7;
                  color: #1E2329;
                  border-radius: 50%;
                  font-size: 3em;
                  width: 1.5em;
                  height: 1.5em;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }

                & > span {
                  margin-top: 5px;
                  letter-spacing: 2.5px;
                }

                &:hover {
                  cursor: pointer;
                  opacity: .8;
                }
              }

              & > div:not(:first-child) { /* link divs */
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 7.5px 15px;
                font-size: 1.05em;
                color: #CBCDD0;
                transition: .2s ease;
                text-align: right;

                &:hover {
                  cursor: pointer;
                  background-color: #181C21;
                }
              }
            }

            & > article {
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 25px;
              box-sizing: border-box;
            }
          }
        `}</style>
      </>
    );
  }
}

export default withAuth(Dashboard, true);
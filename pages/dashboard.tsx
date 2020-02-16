import React from 'react';
import '../style/global.scss';
import withAuth, { AuthProps } from '../middleware/auth';
import WaveBackground, { WaveBackgroundPosition } from '../components/kainplan/WaveBackground';
import Head from 'next/head';

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
          <div>
            <WaveBackground position={WaveBackgroundPosition.TOP} />
          </div>
          <article>
            <div>
              <div>user</div>
            </div>
            <div>
              <h2>{this.props.user.username}</h2>
            </div>
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

            & > article {
              display: flex;
              width: 100%;
              height: 100%;
              justify-content: center;
              align-items: center;
              padding: 25px;
              box-sizing: border-box;
              z-index: 1;

              & > div {
                background-color: rgba(255, 255, 255, .8);
                border: 2px solid #f2f2f2;
                border-radius: 5px;
                padding: 15px;

                &:first-child {
                  margin-right: 15px;
                }
              }
            }
          }
        `}</style>
      </>
    );
  }
}

export default withAuth(Dashboard, true);
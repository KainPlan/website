import '../style/global.scss';
import ResponsiveInputBox from "../components/kainplan/ResponsiveInputBox";
import SearchBox from "../components/kainplan/SearchBox";
import { faBars, faSearch, faFootballBall } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/kainplan/Sidebar";
import Loading from '../components/kainplan/Loading';
import { ToastPosition } from '../components/kainplan/Toast';
import ToastHandler from '../components/kainplan/ToastHandler';
import WaveBackground, { WaveBackgroundPosition } from '../components/kainplan/WaveBackground';
import Head from 'next/head';
import ImageUpload from '../components/kainplan/ImageUpload';

export default () => {
  let sidebar: Sidebar;
  let loading: Loading;
  let toastHandler;

  return (
    <>
      <Head>
        <title>KainPlan ; Test</title>
      </Head>
      <section>
        <div>
          <SearchBox 
            label={[
              "Wonach suchen Sie?", 
              "z.B.: Direktion", 
              "z.B.: Turnsaal", 
              "z.B.: ...",
            ]}
            westIcon={faBars}
            eastIcon={faSearch}
            onWestClick={() => sidebar.show()}
            onEastClick={() => {
              loading.show();
              window.setTimeout(() => loading.hide(), 5000);
            }}
            onContentChange={q => console.log(`Query: ${q}`)}
          />
        </div>
        <Sidebar 
          ref={e => sidebar = e}
          links={[
            { icon: faFootballBall, title: 'Hello World!', href: '/', },
          ]}
          north={
            <button style={{
              position: 'absolute',
              right: '5px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}>Hello World!</button>
          }>
          <div>Hello World!</div>
        </Sidebar>
        <Loading ref={e => loading = e} />
        <h2>Login ...</h2>
        <div>
          <ResponsiveInputBox 
            label="Firstname" 
            onFocus={() => console.log('Hello!')}
            onBlur={() => console.log('Bye!')}
          />
        </div>
        <div>
          <ResponsiveInputBox 
            label="Surname" 
            onContentChange={sname => console.log(`Welcome back, ${sname}!`)}
          />
        </div>
        <ToastHandler ref={e => toastHandler = e} position={ToastPosition.BOTTOM_RIGHT} />
        <button onClick={() => toastHandler.showInfo('Hello!', 5)}>Click me!</button>
      </section>
      <div style={{
        width: '50%',
        height: '200px',
        margin: '0 auto',
      }}>
        <ImageUpload label="Hintergrund" />
      </div>
      <style jsx>{`
        section {
          & > div:not(:last-child) {
            margin-bottom: 2.5px;
          }    

          & > div {
            width: 25%;
            min-width: 300px;
            border: 1.5px solid #f2f2f2;
            border-radius: 3px;
          }
        }
      `}</style>
    </>
  );
}
import App, { AppProps } from 'next/app';
import Router from 'next/router';
import LoadingBar from 'react-top-loading-bar';

class MyApp extends App {
  constructor(props: AppProps) {
    super(props);

    Router.events.on('routeChangeStart', () => {
      this.loadingBar.continuousStart();
    });

    Router.events.on('routeChangeComplete', () => {
      this.loadingBar.complete();
    });
  }

  loadingBar: LoadingBar;

  render() {
    const { Component, pageProps }: AppProps = this.props as AppProps;
    return (
      <>
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 1000,
          }}
        >
          <LoadingBar 
            height={3}
            color="#622dff"
            onRef={ref => this.loadingBar = ref}
          />
        </div>
        <Component {...pageProps} />
      </>
    );
  }
}

export default MyApp;
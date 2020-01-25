import '../style/global.scss';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import React from 'react';
import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons';

class Index extends React.Component {
  onScrollClick() {
    window.document.getElementsByTagName('main')[0].scrollIntoView({
      behavior: 'smooth',
    });
  }

  render() {
    return (
      <>
        <Head>
          <title>KainPlan</title>
        </Head>
        <Header />
        <article>
          <div className="top-main">
            <div className="top-main-inner">
              <video autoPlay muted loop>
                <source src="/media/back_banner_vid.mp4" type="video/mp4" />
              </video>
              <div className="top-foreground">
                <img src="/media/logo_and_text.png" />
              </div>
            </div>
            <div className="scroll-down-container" onClick={this.onScrollClick}>
              <i><FontAwesomeIcon icon={faAngleDoubleDown} /></i>
            </div>
          </div>
          <main>
            <div className="info-element">
              <div className="quote-div">
                <q>Unsere Schule - kartografiert</q>
                <p>Moderne Navigationssoftware die Ihnen hilft, immer den richtigen Pfad durch unser Schulgebäude zu finden.</p>
              </div>
            </div>
            <div className="info-element">
              <div className="quote-div">
                <q>Neue Aspekte der Schule entdecken - mit KainPlan</q>
              </div>
              <div className="img-container">
                <img src="/media/index/destination-mobile-final-2.png" />
                <div>
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
                </div>
              </div>
            </div>
            <div className="info-element">
              <div className="quote-div">
                <q>Seitdem wir KainPlan verwenden, haben wir uns nie wieder verlaufen!</q><span>Hänsel und Gretel, 2019</span>
              </div>
              <div className="img-container">
                <div>
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
                    </div>
                <img src="/media/index/routing-desktop-final.png" />
              </div>
            </div>
            <div className="info-element">
              <div className="quote-div">
                <q>Eine UI so minimalistisch - sogar die Schulkatze könnte sie verwenden</q>
              </div>
              <div className="video-container">
                <div className="video-final">
                  <video autoPlay loop>
                    <source src="/media/index/usage-desktop.mp4" type="video/mp4" />
                  </video>
                  <div className="overlay"></div>
                </div>
                <div>
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
                    </div>
              </div>
            </div>
          </main>
          <style jsx>{`
            article {
              padding-top: 5em;
              
              .top-main {
                position: relative;

                .top-main-inner {
                  display: flex;
                  position: relative;
                  overflow: hidden;

                  video {
                    position: absolute;
                    left: 0; right: 0;
                    width: 100%;
                    z-index: 0;
                    filter: blur(2.5px);
                  }
                
                  .top-foreground {
                    display: flex;
                    justify-content: center;
                    z-index: 1;
                    width: 100%;
                    background-color: rgba(255,255,255,.5);
                    box-sizing: border-box;
                    padding: 1.6em;
                  
                    img {
                      width: 10em;
                      height: auto;
                      z-index: 1;
                    }
                  }
                }

                .scroll-down-container {
                  width: 100%;
                  height: 3em;
                  position: absolute;
                  bottom: -1.5em;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  
                  i {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #fff;
                    border-radius: 50%;
                    font-size: 2em;
                    width: 1.5em;
                    height: 1.5em;
                    color: #222;
                    transition: .3s ease;
                  
                    &:hover {
                      cursor: pointer;
                      transform: scale(1.1);
                    }
                  
                    &:focus {
                      outline: none;
                    }
                  }
                }
              }

              main {
                padding: 0 25px;

                & > *:first-child {
                  padding-top: 15px;
                }

                .info-element {
                  text-align: center;
                  
                  .quote-div {
                    margin: 2em 0;
                
                    q {
                      font-size: 1.6em;
                      display: block;
                  
                      &::before {
                        content: "";
                      }
                    
                      &::after {
                        content: "";
                      }
                    }
                  
                    span {
                      display: block;
                      font-size: .8em;
                      color: #222;
                      margin-left: 5px;
                    }
                  }
                
                  .img-container {
                    width: 100%;
                    box-sizing: border-box;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                
                    & > * {
                      margin-right: 15px;
                  
                      &:last-child {
                        margin-right: 0;
                      }
                    }
                  
                    img {
                      width: auto; height: auto;
                      max-width: 350px; max-height: 400px;
                    }
                  
                    div {
                      max-width: 30%;
                      text-align: left;
                    }
                  }
                
                  .video-container {
                    .video-final {
                      position: relative;
                      display: inline-block;
                      max-width: 50%;
                  
                      * {
                        border-radius: 15px 0;
                      }
                      
                      video {
                        width: 100%;
                        height: auto;
                      }
                    
                      .overlay {
                        position: absolute;
                        left: 0; top: 0;
                        width: 100%; height: 100%;
                        background-color: rgba(255,255,255,.5);
                      }
                    }
                  
                    & > div {
                      max-width: 60%;
                      margin: 0 auto;
                      margin-top: 15px;
                    }
                  }
                }
              }
            }

            @media only screen and (max-width: 600px) {
              .top-foreground {
                img {
                  width: 30% !important;
                }
              }

              .img-container {
                flex-direction: column !important;
                justify-content: space-between !important;

                & > * {
                  margin: 0 !important;
                  margin-bottom: 15px !important;

                  &:last-child {
                    margin-bottom: 0 !important;
                  }
                }

                div {
                  max-width: 100% !important;
                  text-align: center !important;
                }
              }

              .video-container {
                .video-final {
                  max-width: 100% !important;
                }

                & > div {
                  max-width: 100% !important;
                }
              }
            }
          `}</style>
        </article>
        <Footer />
      </>
    );
  }
}

export default Index;
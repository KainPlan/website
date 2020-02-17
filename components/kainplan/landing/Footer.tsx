import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeSquare, faSchool } from '@fortawesome/free-solid-svg-icons';
import { faTwitterSquare, faInstagram, faReddit } from '@fortawesome/free-brands-svg-icons';

const Footer = () => (
  <footer>
    <div className="footer-logo-container">    
      <img src="/media/logo_and_text_bright.png" />
    </div>
    <div className="footer-content-container">
      <h3>// Kontakt</h3>
      <div className="footer-part">
        <a className="icon-link" href="mailto:kainplan@htl-kaindorf.ac.at" rel="noreferrer">
          <i>
            <FontAwesomeIcon icon={faEnvelopeSquare} />
          </i>
        </a>
        <a className="icon-link" href="//htl-kaindorf.at" target="_blank" rel="noreferrer">
          <i>
            <FontAwesomeIcon icon={faSchool} />
          </i>
        </a>
        <a className="icon-link" href="//twitter.com/k41npl4n" target="_blank" rel="noreferrer">
          <i>
            <FontAwesomeIcon icon={faTwitterSquare} />
          </i>
        </a>
        <a className="icon-link" href="//reddit.com/user/k41npl4n" target="_blank" rel="noreferrer">
          <i>
            <FontAwesomeIcon icon={faReddit} />
          </i>
        </a>
        <a className="icon-link" href="//instagram.com/kainplan" target="_blank" rel="noreferrer">
          <i>
            <FontAwesomeIcon icon={faInstagram} />
          </i>
        </a>
      </div>
      <h3>// Links</h3>
      <div className="footer-part">
        <Link href="/map">
          <a>Karte</a>
        </Link>
        <Link href="/team">
          <a>Team</a>
        </Link>
        <Link href="/login">
          <a>Login</a>
        </Link>
      </div>
      <div className="copyright-notice">
        &copy; 2020 KainPlan GmbH
      </div>
    </div>
    <style jsx>{`
      @import url('https://fonts.googleapis.com/css?family=Space+Mono&display=swap');
      
      footer {
        margin-top: 50px;
        background-color: #303841;
        padding: 25px;
        display: flex;
        justify-content: center;
        align-items: stretch;
        color: #e6f2ff;
        box-shadow: 0px -1px 15px #aaa;

        .footer-logo-container {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding-right: 15px;
          margin-right: 15px;
          border-right: 3px solid #e6f2ff;

          img {
            width: 10em; 
            height: auto;
          }
        }

        .footer-content-container {
          display: flex;
          flex-direction: column;
          justify-content: stretch;
          align-items: stretch;

          h3 {
            margin: 0;
            margin-bottom: 7.5px;
            font-size: 1.7em;
            font-family: 'Space Mono', monospace;
          }

          .footer-part {
            text-align: right;
            margin-bottom: 7.5px;
            font-size: 1.1em;

            a {
              color: inherit;
            }

            .icon-link {
              text-decoration: none;

              i {
                font-size: 1.6em;
                transition: .3s ease;

                &:hover {
                  cursor: pointer;
                  transform: scale(1.1);
                }
              }
            }

            & > * {
              margin-right: 7.5px;

              &:last-child {
                margin-right: 0;
              }
            }

            &:last-child {
              margin-bottom: 0;
            }
          }

          .copyright-notice {
            flex-grow: 1;
            display: flex;
            justify-content: flex-end;
            align-items: flex-end;
            font-family: 'Space Mono', monospace;
            font-size: .8em;
          }
        }
      }

      @media only screen and (max-width: 600px) {
        footer {
          flex-direction: column;
          justify-content: space-between !important;
          align-items: stretch !important;

          .footer-logo-container {
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            border-bottom: 2px solid #e6f2ff !important;
            border-radius: 25%;
            margin-bottom: 25px !important; 
            justify-content: center !important;

            .footer-logo {
              width: 7em !important;
            }
          }

          .footer-content-container {
            width: 75%;
            margin: 0 auto;

            .copyright-notice {
              margin-top: 15px;
              padding-top: 15px;
              border-top: 2px dashed #e6f2ff;
            }

            .icon-link {
              i {
                font-size: 2em !important;
              }
            }
          }
        }
      }
    `}</style>
  </footer>
);

export default Footer;
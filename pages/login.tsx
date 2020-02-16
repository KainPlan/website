import '../style/global.scss';
import React, { FormEvent } from 'react';
import anime from 'animejs';
import ResponsiveInputBox from '../components/kainplan/ResponsiveInputBox';
import Router from 'next/router';
import fetch from 'isomorphic-unfetch';
import ToastHandler from '../components/kainplan/ToastHandler';
import { ToastPosition } from '../components/kainplan/Toast';
import { withCookies, Cookies } from 'react-cookie';
import { Cookie } from 'universal-cookie';
import WaveBackground, { WaveBackgroundPosition } from '../components/kainplan/WaveBackground';
import Head from 'next/head';

interface LoginProps {
  cookies: Cookies;
  allCookies: Cookie[];
}

interface LoginState extends LoginProps {
}

class Login extends React.Component<LoginProps, LoginState> {
  constructor(props) {
    super(props);
    this.state = {
      cookies: props.cookies,
      allCookies: props.allCookies,
    };
  }

  usernameIn: ResponsiveInputBox;
  passwordIn: ResponsiveInputBox;
  toaster: ToastHandler;

  showError(msg) {
    this.toaster.showError(msg, Math.round(msg.length/16)+2);
  }

  convertError(msg) {
    const msgs: { [id: string]: string } = {
      'Invalid username!': 'Ungültiger Nutzername!',
      'Wrong password!': 'Falsches Passwort!',
    };
    return msgs[msg] || msg;
  }

  onSubmit(e: FormEvent) {
    e.preventDefault();
    let uname: string = this.usernameIn.state.content;
    let pwd: string = this.passwordIn.state.content;
    if (uname.trim() === '' || pwd.trim() === '') {
      this.showError('Nutzername / Passwort fehlt!');
    } else {
      if (process.env.NODE_ENV === 'development') process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      fetch('https://localhost:42069/login', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uname: this.usernameIn.state.content,
          pwd: this.passwordIn.state.content,
        }),
      })
      .then(res => res.json())
      .then(res => {
        if (!res.success) {
          this.showError(this.convertError(res.msg));
        } else {
          this.state.cookies.set('tkn', res.token, { path: '/', });
          Router.push('/dashboard');
        }
      });
    }
  }

  render() {
    return (
      <>
        <Head>
          <title>KainPlan ; Login</title>
        </Head>
        <main>
          <WaveBackground animated position={WaveBackgroundPosition.BOTTOM} />
          <form onSubmit={this.onSubmit.bind(this)}>
            <h1>Anmelden</h1>
            <ResponsiveInputBox label="Nutzername" ref={e => this.usernameIn = e} />
            <ResponsiveInputBox label="Passwort" type="password" ref={e => this.passwordIn = e} />
            <input type="submit" value="Bestätigen" />
          </form>
          <ToastHandler 
            position={ToastPosition.BOTTOM_RIGHT} 
            ref={e => this.toaster = e}
          />
          <footer>
            <a onClick={() => Router.back()}>
              Back
            </a>
            <span>
              design &copy; KainPlan
              <span>jk</span>
            </span>
          </footer>
        </main>
        <style jsx>{`
          main {
            width: 100%;
            height: 100%;

            form {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background-color: rgba(255,255,255,.85);
              mix-blend-mode: screen;
              padding: 30px;
              border: 2.5px solid #f2f2f2;
              border-radius: 5px 5px 20% 5px;

              input[type="submit"] {
                border: none;
                margin-top: 1.2em;
                background-image: linear-gradient(to right, rgba(255,255,255,.2) 0%, rgba(255,255,255,.2) 50%, #622dff 50%, #622dff 100%);
                background-size: 200% 100%;
                background-position: 0 0;
                border: 1.5px solid #622dff;
                border-radius: 25px;
                width: 100%;
                font-size: 1em;
                padding: 7.5px 0;
                font-weight: lighter;
                text-transform: uppercase;
                color: #622dff;
                transition: .25s ease;

                &:hover, &:focus {
                  outline: none;
                  cursor: pointer;
                  background-position: 100% 0;
                  color: #fff;
                }
              }
            }

            footer {
              position: fixed;
              width: 100%;
              bottom: 0;
              padding: 5px;
              color: #fff;
              display: flex;
              box-sizing: border-box;
              justify-content: space-between;
              align-items: center;
              font-family: 'Open Sans', sans-serif;

              & > a {
                color: inherit;
                font-family: inherit;
                text-decoration: underline;

                &:hover {
                  cursor: pointer;
                }
              }

              & > span {
                font-family: inherit;

                & > span {
                  font-size: .45em;
                  margin-left: 1px;
                  font-family: monospace;
                }
              }
            }
          }  

          @media only screen and (max-width: 600px) {
            main {
              footer {
                left: 50%;
                transform: translateX(-50%);
                width: 90%;
              }
            }
          }
        `}</style>
      </>
    );
  }
}

export default withCookies(Login);
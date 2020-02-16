import React from 'react';
import cookies from 'next-cookies';
import fetch from 'isomorphic-unfetch';

export interface AuthProps {
  loggedIn: boolean;
  user: {
    username: string;
    isAdmin: boolean;
  };
}

function withAuth(Component: React.ComponentType, strict?: boolean, adminOnly?: boolean): React.ComponentType {
  return class WithAuth extends React.Component<AuthProps> {
    static async getInitialProps(ctx) {
      let notLoggedIn: AuthProps = {
        loggedIn: false,
        user: {
          username: '',
          isAdmin: false,
        },
      };

      let allCookies: Record<string, string> = cookies(ctx);
      if (!allCookies.tkn) return notLoggedIn;
      
      if (process.env.NODE_ENV === 'development') process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      const res = await fetch(`https://localhost:42069/profile/${allCookies.tkn}`);
      const data = await res.json();

      if (!data.success) return notLoggedIn;
      return {
        loggedIn: true,
        user: data.user,
      };
    }

    componentDidMount() {
      if (strict && !this.props.loggedIn) return window.location.assign('/login');
      if (adminOnly && !this.props.user.isAdmin) return window.location.assign('/dashboard');
    }

    render() {
      return (
        <>
          {(strict && !this.props.loggedIn) || (adminOnly && !this.props.user.isAdmin) ? <div>Umleiten ... </div> : <Component {...this.props} />}
        </>
      );
    }
  }
};

export default withAuth;
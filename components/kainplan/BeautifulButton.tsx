import React from 'react';

interface BeautifulButtonProps {
  label: string;
  type?: string;
  onClick?: ()=>void;
}

interface BeautifulButtonState {
}

class BeautifulButton extends React.Component<BeautifulButtonProps, BeautifulButtonState> {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <>
        <input 
          type={this.props.type || 'button'} 
          value={this.props.label} 
          onClick={() => this.props.onClick && this.props.onClick()}  
        />
        <style jsx>{`
          input {
              background-color: #fff;
              border: 1.5px solid #622dff;
              border-radius: 15px;
              font-family: 'Roboto', sans-serif;
              text-transform: uppercase;
              font-weight: lighter;
              color: #622dff;
              font-size: .9em;
              padding: 5px 10px;
              transition: .25s ease;
              background-image: linear-gradient(to right, #fff 0%, #fff 50%, #622dff 50%, #622dff 100%);
              background-size: 205% 100%;
              background-position: 0 0;

              &:hover, &:focus {
                outline: none;
                cursor: pointer;
                background-position: 100% 0;
                color: #fff;
                font-weight: normal;
              }
            }
        `}</style>
      </>
    );
  }
}

export default BeautifulButton;
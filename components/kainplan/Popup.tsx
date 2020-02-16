import React from 'react';
import anime from 'animejs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, IconDefinition, faEyeDropper } from '@fortawesome/free-solid-svg-icons';

export interface PopupProps {
  title: string;
  children?: React.ReactNode;
  icon?: IconDefinition;
  visible?: boolean;
  unCloseable?: boolean;
  onHide?: () => void;
}

export interface PopupState {
  visible: boolean;
  onHide: () => void;
}

class Popup extends React.Component<PopupProps, PopupState> {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
      onHide: props.onHide || (() => undefined),
    };
  }

  window: HTMLDivElement;

  show() {
    anime.remove(this.window);
    this.setState({
      visible: true,
    }, () => anime({
      targets: this.window,
      scale: [0, 1],
      duration: 500,
      easing: 'easeOutBack',
    }));
  }

  hide() {
    if (!this.props.unCloseable) {
      anime.remove(this.window);
      anime({
        targets: this.window,
        scale: [1, 0],
        duration: 400,
        easing: 'easeInBack',
      }).finished.then(() => this.setState({
        visible: false,
      }, () => this.state.onHide()));
    } else {
      anime({
        targets: this.window,
        translateX: [0, -25],
        duration: 100,
        easing: 'linear',
      }).finished.then(() => anime({
        targets: this.window,
        translateX: [-25, 25],
        duration: 150,
        easing: 'linear',
      }).finished.then(() => anime({
        targets: this.window,
        translateX: [25, 0],
        duration: 300,
        easing: 'easeOutElastic',
      })));
    }
  }

  render() {
    return (
      <>
        <div 
          className="popup-root"
          style={{
            display: this.state.visible ? 'block' : 'none',
          }}
          onClick={() => this.hide()}
        >
          <div ref={e => this.window = e}>
            <div>
              <label>
                <i>
                  <FontAwesomeIcon icon={this.props.icon || faEyeDropper } />
                </i>
                {this.props.title}
              </label>
              {
                !this.props.unCloseable && 
                <i onClick={() => this.hide()}>
                  <FontAwesomeIcon icon={faTimes} />
                </i>
              }
            </div>
            <div>
              {this.props.children}
            </div>
          </div>
        </div>
        <style jsx>{`
          .popup-root {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, .4);

            & > div {
              width: 60%;
              background-color: white;
              margin: 1.5em auto;
              border-radius: 0 0 3px 3px;
              position: relative;

              & > div:first-child {
                background-color: #622DFF;
                color: #efefef;
                font-weight: lighter;
                display: flex;
                justify-content: space-between;
                align-items: center;

                & > label {
                  padding: 5px 7.5px;

                  & > i {
                    margin-right: 7.5px;
                  }
                }

                & > i {
                  padding: 5px 7.5px;
                  transition: .2s ease;

                  &:hover {
                    background-color: #FF2D61;
                    cursor: pointer;
                  }
                }
              }

              & > div:not(:first-child) {
                padding: 25px 10px;
              }
            }
          }
        `}</style>
      </>
    );
  }
}

export default Popup;
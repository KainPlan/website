import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faExclamationTriangle, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

export enum ToastType {
  ERROR, WARNING, INFO
}

export enum ToastPosition {
  TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT, TOP_CENTER, BOTTOM_CENTER, UNALIGNED
}

interface ToastProps {
  type: ToastType;
  msg: string;
  position: ToastPosition;
  rootRef?: React.RefObject<HTMLDivElement>;
  onClose?: () => void;
}

interface ToastState extends ToastProps {
}

class Toast extends React.Component<ToastProps, ToastState> {
  constructor(props) {
    super(props);
    this.state = {
      type: props.type,
      msg: props.msg,
      position: props.position,
      onClose: props.onClose || (() => undefined),
    };
  }

  render() {
    return (
      <>
        <div className="toast-root" ref={this.props.rootRef}>
          <i style={{
            color: this.state.type === ToastType.ERROR ? '#FF2D61' : this.state.type === ToastType.WARNING ? '#FFCB2D' : '#622DFF',
          }}>
            <FontAwesomeIcon icon={
              this.state.type === ToastType.ERROR ? faExclamationCircle
              : this.state.type === ToastType.WARNING ? faExclamationTriangle
              : faInfoCircle
            }/>
          </i>
          <div>
            {this.state.msg}
          </div>
          <i style={{

          }}>
            <FontAwesomeIcon 
              icon={faTimes} 
              onClick={() => this.state.onClose()}
            />
          </i>
        </div>
        <style jsx>{`
          .toast-root {
            display: flex;
            justify-content: stretch;
            align-items: center;
            padding: 10px;
            border: 1.5px solid #f2f2f2;
            background-color: rgba(255,255,255,.5);
            border-radius: 4px;
            color: #222;
            width: 250px;
            word-wrap: break-word;
            position: ${this.state.position === ToastPosition.UNALIGNED ? '' : 'fixed'};
            z-index: 20;
            ${
              this.state.position === ToastPosition.TOP_LEFT ? `left: 5px; top: 5px;`
              : this.state.position === ToastPosition.TOP_RIGHT ? `right: 5px; top: 5px;`
              : this.state.position === ToastPosition.BOTTOM_LEFT ? `left: 5px; bottom: 5px;`
              : this.state.position === ToastPosition.BOTTOM_RIGHT ? `right: 5px; bottom: 5px;`
              : this.state.position === ToastPosition.BOTTOM_CENTER ? `left: 50%; transform: translateX(-50%); bottom: 5px;`
              : this.state.position === ToastPosition.TOP_CENTER ? `left: 50%; transform: translateX(-50%); top: 5px;`
              : ``
            }

            & > i:not(:last-child) {
              margin-right: 10px;
            }

            & > i:last-child {
              color: #888;
              transition: .2s ease;

              &:hover {
                cursor: pointer;
                color: #FF2D61;
              }
            }

            & > div {
              flex-grow: 1;
            }
          }

          @media only screen and (max-width: 600px) {
            .toast-root {
              bottom: 5px !important;
              left: 15px !important;
              right: 15px !important;
              width: auto;
            }
          }
        `}</style>
      </>
    );
  }
}

export default Toast;
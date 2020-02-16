import React from 'react';
import Popup, { PopupProps } from './Popup';

interface SelectPopupProps extends PopupProps {
}

interface SelectPopupState {
}

class SelectPopup extends React.Component<SelectPopupProps, SelectPopupState> {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  popup: Popup;

  show() {
    if (!this.popup.state.visible) this.popup.show();
  }

  hide() {
    if (this.popup.state.visible) this.popup.hide();
  }

  render() {
    return (
      <>
        <Popup
          {...this.props}
          onHide={() => this.hide()}
          ref={e => this.popup = e}
        >
          
        </Popup>
      </>
    );
  }
}

export default SelectPopup;
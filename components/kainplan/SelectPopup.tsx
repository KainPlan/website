import React from 'react';
import Popup, { PopupProps } from './Popup';
import Select, { SelectItem, SelectProps } from './Select';

interface SelectPopupProps extends PopupProps, SelectProps {
  children: SelectItem[];
  onSubmit?: (selected: SelectItem|SelectItem[]) => void;
}

interface SelectPopupState {
  children: SelectItem[];
  onSubmit?: (selected: SelectItem|SelectItem[]) => void;
}

class SelectPopup extends React.Component<SelectPopupProps, SelectPopupState> {
  constructor(props) {
    super(props);
    this.state = {
      children: props.children,
      onSubmit: props.onSubmit || (() => undefined),
    };
  }

  popup: Popup;
  select: Select;

  setCloseable(closeable: boolean) {
    this.popup.setCloseable(closeable);
  }

  setChildren(children: SelectItem[]) {
    this.setState({
      children: children,
    }, () => this.select.setChildren(this.state.children));
  }

  show() {
    if (!this.popup.state.visible) this.popup.show();
  }

  hide() {
    if (this.popup.state.visible) this.popup.hide();
  }

  onSubmit(selected: SelectItem|SelectItem[]) {
    if ((Array.isArray(selected) && selected.length > 0)
        || (!Array.isArray(selected) && typeof selected !== "undefined")) {
      this.hide();
      this.state.onSubmit(selected);  
    } else {
      this.popup.wiggle();
    }
  }

  render() {
    return (
      <>
        <Popup
          {...this.props}
          visible={this.props.visible}
          onHide={() => this.hide()}
          ref={e => this.popup = e}
        >
          <Select 
            multiple={this.props.multiple}
            onSubmit={this.onSubmit.bind(this)}  
            ref={e => this.select = e}
          >
            {this.state.children}
          </Select>
        </Popup>
      </>
    );
  }
}

export default SelectPopup;
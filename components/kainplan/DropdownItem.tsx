import React from 'react';

export interface DropdownAction {
  id: string;
  label: string;
}

export interface DropdownItemProps {
  label: string;
  children: (DropdownItem|DropdownAction)[];
  actionHandler?: (action: DropdownAction) => void;
}

interface DropdownItemState {
}

class DropdownItem extends React.Component<DropdownItemProps, DropdownItemState> {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <>
        <div className="dropdownitem-root">
          {this.props.label}
        </div>
        <style jsx>{`
          .dropdownitem-root {
            &:not(:last-child) {
              margin-right: 7.5px;
            }
          }
        `}</style>
      </>
    );
  }
}

export default DropdownItem;
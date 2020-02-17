import React from 'react';
import DropdownItem, { DropdownAction, DropdownItemProps } from './DropdownItem';

interface DropdownGroupProps {
  items: (DropdownItemProps|DropdownAction)[];
  actionHandler: (action: DropdownAction) => void;
}

interface DropdownGroupState {
}

class DropdownGroup extends React.Component<DropdownGroupProps, DropdownGroupState> {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <>
        <div className="dropdowngroup-root">
          { this.props.items.map((it, i) => Object.keys(it).includes('children')
            ? <DropdownItem key={i} label={it.label} children={(it as DropdownItemProps).children} /> 
            : <div 
                key={i} 
                onClick={() => this.props.actionHandler(it as DropdownAction)}
              >{it.label}</div>)
          }
        </div>
        <style jsx>{`
          .dropdowngroup-root {
            display: flex;

            & > div:not(:last-child) {
              margin-right: 7.5px;
            }
          }  
        `}</style>
      </>
    );
  }
}

export default DropdownGroup;
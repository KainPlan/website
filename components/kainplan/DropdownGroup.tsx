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

  dropdowns: DropdownItem[] = [];

  componentDidMount() {
    this.dropdowns.forEach((d: DropdownItem) => {
      d.init(this.props.actionHandler);
    });
    window.addEventListener('resize', this.onResize.bind(this));
  }

  hideOthers(cb?: ()=>void) {
    this.dropdowns.forEach((d: DropdownItem) => {
      d.hideAllSub();
    });
    if (cb) cb();
  }

  hideAllSub(cb?: ()=>void) {
    this.dropdowns.forEach((d: DropdownItem) => {
      d.hideAllSub();
    });
    if (cb) cb();
  }

  onResize() {
    this.hideAllSub();
  }

  addDropdown(d: DropdownItem) {
    if (!d) return;
    this.dropdowns.push(d);
  }

  render() {
    return (
      <>
        <div className="dropdowngroup-root">
          { this.props.items.map((it, i) => Object.keys(it).includes('children')
            ? <DropdownItem 
                key={i} 
                label={it.label} 
                children={(it as DropdownItemProps).children} 
                parent={this}
                below 
                ref={e => this.addDropdown(e)}  
              /> 
            : <div 
                key={i} 
                onClick={() => this.props.actionHandler(it as DropdownAction)}
              >{it.label}</div>)
          }
        </div>
        <style jsx>{`
          .dropdowngroup-root {
            display: flex;
          }  
        `}</style>
      </>
    );
  }
}

export default DropdownGroup;
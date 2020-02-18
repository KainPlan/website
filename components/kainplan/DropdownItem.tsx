import React, { Children } from 'react';
import DropdownGroup from './DropdownGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

export interface DropdownAction {
  id: string;
  label: string|React.ReactNode;
}

enum DropdownDirection {
  LEFT, RIGHT
}

export interface DropdownItemProps {
  label: string|React.ReactNode;
  children: (DropdownItemProps|DropdownAction)[];
  parent?: DropdownGroup|DropdownItem;
  below?: boolean;
  direction?: DropdownDirection;
  actionHandler?: (action: DropdownAction) => void;
}

interface DropdownItemState {
  x: number;
  y: number;
  direction: DropdownDirection;
  subShown: boolean;
  actionHandler: (action: DropdownAction) => void;
}

class DropdownItem extends React.Component<DropdownItemProps, DropdownItemState> {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      direction: props.direction,
      subShown: false,
      actionHandler: ()=>undefined,
    };
  }

  cover: HTMLDivElement;
  sub: HTMLDivElement;
  subPoints: DropdownItem[] = [];

  addSubPoint(sp: DropdownItem) {
    if (!sp) return;
    this.subPoints.push(sp);
  }

  init(actionHandler: (action: DropdownAction) => void) {
    this.setState({
      actionHandler,
    }, () => this.initDirection(() => {
      this.subPoints.forEach((sp: DropdownItem) => {
        sp.setDirection(this.state.direction, () => sp.init(actionHandler));
      });
    }));
  }

  initDirection(cb?: ()=>void) {
    if (typeof this.state.direction === 'undefined') {
      let rect: DOMRect = this.cover.getBoundingClientRect();
      this.setState({
        direction: rect.x > window.innerWidth - rect.x ? DropdownDirection.LEFT : DropdownDirection.RIGHT,
      }, cb);
    }
  }

  setDirection(direction: DropdownDirection, cb?: ()=>void) {
    this.setState({
      direction,
    }, cb);
  }

  alignSub() {
    let rect: DOMRect = this.cover.getBoundingClientRect();
    this.setState({
      x: this.props.below 
          ? (this.state.direction === DropdownDirection.RIGHT ? rect.left : rect.right - this.sub.getBoundingClientRect().width)
          : (this.state.direction === DropdownDirection.RIGHT ? rect.x + rect.width : rect.left - this.sub.getBoundingClientRect().width),
      y: rect.y + (this.props.below ? rect.height : 0),
    });
  }

  showSub() {
    this.props.parent.hideOthers(() => this.setState({
      subShown: true,
    }, () => this.alignSub()));
  }

  hideSub() {
    this.setState({
      subShown: false,
    });
  }

  hideOthers(cb?: ()=>void) {
    this.subPoints.forEach((sp: DropdownItem) => {
      sp.hideAllSub();
    });
    if (cb) cb();
  }

  hideAllSub(cb?: ()=>void) {
    this.subPoints.forEach((sp: DropdownItem) => {
      sp.hideAllSub();
    });
    this.hideSub();
    if (cb) cb();
  }

  onToggleSub(e: React.MouseEvent) {
    e.stopPropagation();
    if (!this.state.subShown) return this.showSub();
    this.hideAllSub();
  }

  onAction(action: DropdownAction) {
    this.props.parent.hideAllSub();
    this.state.actionHandler(action);
  }

  render() {
    return (
      <>
        <div 
          className="dropdownitem-root"
          ref={e => this.cover = e}
          onClick={this.onToggleSub.bind(this)}
        >
          <div>
            { this.props.label }
            { !this.props.below && <i className="dropdown-item-more"><FontAwesomeIcon icon={faAngleRight} /></i> || ''}
          </div>
          <div ref={e => this.sub = e}>
            {
              this.props.children.map((it, i) => Object.keys(it).includes('children')
                ? <DropdownItem 
                    key={i} 
                    label={it.label} 
                    parent={this}
                    children={(it as DropdownItemProps).children} 
                    ref={e => this.addSubPoint(e)}  
                  /> 
                : <div 
                    key={i} 
                    onClick={() => this.onAction(it as DropdownAction)}
                    style={{
                      padding: '2.5px 5px',
                    }}
                    className="dropdown-action"
                  >{it.label}</div>)  
            }
          </div>
        </div>
        <style jsx>{`
          .dropdownitem-root {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 2.5px 5px;
            user-select: none;
            transition: .2s ease;

            & > div:first-child {
              display: flex;
              justify-content: space-between;
              align-items: center;

              &:hover {
                cursor: default;
                opacity: .8;
              }

              & > .dropdown-item-more {
                margin-left: 7.5px;
              }
            }

            & > div:last-child {
              display: ${this.state.subShown ? 'block' : 'none'};
              position: fixed;
              left: ${this.state.x}px;
              top: ${this.state.y}px;
              padding: 5px 0;
              background-color: #fff;
              z-index: 1;
              border: 1.5px solid #f2f2f2;
              white-space: nowrap;
              box-shadow: .5px .5px 3px #cecece;

              & > .dropdown-action {
                transition: .2s ease;

                &:hover {
                  cursor: pointer;
                  color: #622dff;
                }
              }
            }
          }
        `}</style>
      </>
    );
  }
}

export default DropdownItem;
import React from 'react';
import BeautifulButton from './BeautifulButton';

export interface SelectItem {
  info: React.ReactNode|string;
}

export interface SelectProps {
  children: SelectItem[];
  multiple?: boolean;
  onSubmit?: (selected: SelectItem|SelectItem[]) => void;
}

interface SelectState {
  children: SelectItem[];
  selected: number[];
  lastSelected: number;
  onSubmit: (selected: SelectItem|SelectItem[]) => void;
}

class Select extends React.Component<SelectProps, SelectState> {
  constructor(props) {
    super(props);
    this.state = {
      children: props.children,
      selected: [],
      lastSelected: 0,
      onSubmit: props.onSubmit || (() => undefined),
    };
  }

  setChildren(children: SelectItem[]) {
    this.setState({
      children: children,
    });
  }

  onSelect(e, key) {
    if (this.props.multiple && e.ctrlKey && e.shiftKey) return this.selectRange(this.state.lastSelected, key, true);
    else if (this.props.multiple && e.ctrlKey) return this.toggleSelect(key);
    else if (this.props.multiple && e.shiftKey) return this.selectRange(this.state.lastSelected, key);
    this.select(key);
  }

  select(key) {
    this.setState({
      selected: [key, ],
      lastSelected: key,
    });
  }

  selectRange(from, to, keepSelected=false) {
    this.setState({
      selected: Array.from(new Set([
        ...keepSelected ? this.state.selected : [],
        ...[...new Array(Math.max(from, to)+1).keys()].slice(Math.min(from, to)),
      ])),
      lastSelected: Math.max(from, to),
    });
  }

  toggleSelect(key) {
    if (this.state.selected.includes(key)) {
      return this.setState({
        selected: this.state.selected.filter(k => k !== key),
      });
    }
    this.setState({
      selected: [ ...this.state.selected, key, ],
      lastSelected: key,
    });
  }

  getSelected(): SelectItem|SelectItem[] {
    if (!this.props.multiple) return this.state.children[this.state.selected[0]];
    return this.state.children.filter((_, i) => this.state.selected.includes(i));
  }

  onSubmit() {
    this.state.onSubmit(this.getSelected());
  }

  render() {
    return (
      <>
        <div className="select-root">
          <div>
            { this.state.children.map((c, i) => 
              <div 
                className={`select-item ${this.state.selected.includes(i) ? 'selected' : ''}`}
                key={i}
                onClick={e => this.onSelect(e, i)}
              >
                { this.props.multiple && 
                  <input 
                    checked={this.state.selected.includes(i)}
                    type="checkbox" 
                    onClick={e => {
                      e.ctrlKey = true;
                      this.onSelect(e, i);
                      e.stopPropagation();
                      return true;
                    }} 
                  /> 
                }
                { c.info }
              </div>) 
            }
          </div>
          <div>
            <BeautifulButton
              label="Bestätigen"
              onClick={this.onSubmit.bind(this)}
            />
          </div>
        </div>
        <style jsx>{`
          .select-root {
            & > div:first-child {
              margin-bottom: 15px;
              max-height: 300px;
              overflow: auto;

              &::-webkit-scrollbar {
                background-color: #fff;
                width: 10px;
              }

              &::-webkit-scrollbar-button {
                display: none;
              }

              &::-webkit-scrollbar-track {
                background-color: #fff;
              }

              &::-webkit-scrollbar-thumb {
                background-color: #622dff;
                border-radius: 10px;
              }

              .select-item {
                padding: 3px 10px;
                color: #222;
                border-left: 3.5px solid rgba(0, 0, 0, 0);
                transition: .2s ease;
                width: 100%;
                box-sizing: border-box;
                display: flex;
                justify-content: stretch;
                align-items: stretch;
                user-select: none;

                input[type="checkbox"] {
                  margin-right: 7.5px;

                  &:focus {
                    outline: none;
                  }
                }

                &:nth-child(even) {
                  background-color: #f4f4f4;
                  border-color: #f4f4f4;
                }

                &.selected {
                  background-color: #eaeaea;
                  border-color: #622dff;
                  color: #622dff;

                  &:nth-child(even) {
                    background-color: #dfdfdf;
                  }
                }

                &:not(.selected):hover {
                  cursor: pointer;
                  opacity: .9;
                  border-color: #ddd;
                  background-color: rgba(0, 0, 0, .1);
                }
              }
            }

            & > div:last-child {
              display: flex;
              justify-content: flex-end;
            }
          }

          @media only screen and (max-width: 600px) {
            .select-root {
              & > div:first-child {
                .select-item {
                  padding: 7.5px 10px;
                }
              }

              & > div:last-child {
                input {
                  width: 100%;
                }
              }
            }
          }
        `}</style>
      </>
    );
  }
}

export default Select;
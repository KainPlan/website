import React from 'react';
import TenFingers from '../tenfingers/TenFingers';

interface ResponsiveInputBoxProps {
  label: string|string[];
  type?: string;
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  onContentChange?: (content: string) => void;
}

interface ResponsiveInputBoxState extends ResponsiveInputBoxProps {
  active: boolean;
  content: string;
}

class ResponsiveInputBox extends React.Component<ResponsiveInputBoxProps, ResponsiveInputBoxState> {
  constructor(props) {
    super(props);
    this.state = {
      label: props.label,
      type: props.type || 'text',
      active: false,
      content: '',
      onFocus: props.onFocus || (() => undefined),
      onBlur: props.onBlur || (() => undefined),
      onContentChange: props.onContentChange || (() => undefined),
    };
  }

  input: HTMLInputElement;

  focus() {
    this.input.focus();
  }

  onFocus(e: FocusEvent) {
    this.setState({
      active: true,
    }, () => this.state.onFocus(e));
  }

  onBlur(e: FocusEvent) {
    this.setState({
      active: this.state.content.length > 0 ? true : false,
    }, () => this.state.onBlur(e));
  }

  onKeyUp(e: KeyboardEvent) {
    if (e.keyCode === 27) return (e.target as HTMLInputElement).blur();
    if ((e.target as HTMLInputElement).value !== this.state.content) {
      this.setState({
        content: (e.target as HTMLInputElement).value,
      }, () => this.state.onContentChange(this.state.content));
    }
  }

  render() {
    return (
      <>
        <div className="searchbox-root">
          <div style={{
            height: this.state.active ? "1.5em" : "0",
          }}></div>
          <div>
            <input 
              ref={e => this.input = e}
              type={this.state.type}
              onFocus={this.onFocus.bind(this)} 
              onBlur={this.onBlur.bind(this)}
              onKeyUp={this.onKeyUp.bind(this)}
              spellCheck="false"
              autoComplete="off"
            />
            <label style={{
              color: this.state.active ? "#afafaf" : "#ababab",
              fontSize: this.state.active ? ".8em" : "inherit",
              top: this.state.active ? "-.2em" : "50%",
            }}>
              {
                Array.isArray(this.state.label) 
                  ? <TenFingers values={this.state.label} endEndTimeout={500} />
                  : this.state.label
              }
            </label>
          </div>
        </div>
        <style jsx>{`
          .searchbox-root {
            display: flex;
            width: 100%;
            flex-direction: column;
            justify-content: stretch;
            align-items: stretch;
            padding: 0;
            font-size: 1.05em;
            font-family: 'Roboto', sans-serif;

            & > div:first-child {
              font-size: .5em;
              margin-bottom: 2.5px;
              opacity: 0;
              transition: .2s ease;
            }

            & > div {
              position: relative;
              flex-grow: 1;
              display: flex;
              justify-content: stretch;
              align-items: stretch;

              input {
                flex-grow: 1;
                padding: 5px;
                border: none;
                position: relative;
                font-size: inherit;
                color: #444;
                transition: .2s ease;
                background-color: rgba(0,0,0,0);

                &:focus {
                  outline: none;
                  color: #222;
                }

                &::selection {
                  background-color: #622dff;
                  color: #fff;
                }
              }

              label {
                position: absolute;
                left: 5px;
                top: 50%;
                transform: translateY(-50%);
                transition: .2s ease;
                pointer-events: none;
              }
            }
          }
        `}</style>
      </>
    );
  }
}

export default ResponsiveInputBox;
import React from 'react';
import ResponsiveInputBox from './ResponsiveInputBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface SearchBoxProps {
  label: string|string[];
  westIcon: IconDefinition;
  eastIcon: IconDefinition;
  onWestClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onEastClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  onContentChange?: (content: string) => void;
}

interface SearchBoxState extends SearchBoxProps {
}

class SearchBox extends React.Component<SearchBoxProps, SearchBoxState> {
  constructor(props) {
    super(props);
    this.state = {
      label: props.label,
      westIcon: props.westIcon,
      eastIcon: props.eastIcon,
      onWestClick: props.onWestClick || (() => undefined),
      onEastClick: props.onEastClick || (() => undefined),
      onFocus: props.onFocus || (() => undefined),
      onBlur: props.onBlur || (() => undefined),
      onContentChange: props.onContentChange || (() => undefined),
    };
  }

  input: ResponsiveInputBox;

  focus() {
    this.input.focus();
  }
  
  render() {
    return (
      <>
        <div>
          <i onClick={this.state.onWestClick}>
            <FontAwesomeIcon icon={this.state.westIcon} />
          </i>
          <div>
            <ResponsiveInputBox 
              ref={e => this.input = e}
              label={this.state.label} 
              onFocus={this.state.onFocus}
              onBlur={this.state.onBlur}
              onContentChange={this.state.onContentChange}
            />
          </div>
          <i onClick={this.state.onEastClick}>
            <FontAwesomeIcon icon={this.state.eastIcon} />
          </i>
        </div>
        <style jsx>{`
          div {
            display: flex;
            justify-content: stretch;
            align-items: stretch;

            & > i {
              display: flex;
              align-items: center;
              padding: 0 10px;
              color: #dadada;
              transition: .2s ease;

              &:hover {
                cursor: pointer;
                transform: scale(1.1);
                color: #622dff;
              }
            }

            & > div {
              flex-grow: 1;
              border-left: 1px solid #f2f2f2;
              border-right: 1px solid #f2f2f2;
            }
          }  
        `}</style>
      </>
    );
  }
}

export default SearchBox;
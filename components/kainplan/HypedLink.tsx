import React from 'react';
import Link from 'next/link';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export enum HypedIconPosition {
  BEFORE, AFTER
}

interface HypedLinkProps {
  label: string;
  href: string;
  icon?: IconDefinition;
  position?: HypedIconPosition;
}

interface HypedLinkState {
  position: HypedIconPosition;
}

class HypedLink extends React.Component<HypedLinkProps, HypedLinkState> {
  constructor(props) {
    super(props);
    this.state = {
      position: typeof props.position !== 'undefined' ? props.position : HypedIconPosition.AFTER,
    };
  }

  render() {
    return (
      <>
        <Link href={this.props.href}>
          <div>
            <a>
              { this.state.position === HypedIconPosition.AFTER && this.props.label }
              { typeof this.props.icon !== 'undefined' && <i><FontAwesomeIcon icon={this.props.icon} /></i> } 
              { this.state.position === HypedIconPosition.BEFORE && this.props.label }
            </a>    
          </div>
        </Link>
        <style jsx>{`
          div {
            display: inline-block;
            background-size: 200% 100%;
            background-image: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0,0,0,0) 50%, #622dff 50%, #622dff 100%);
            background-position: 0 0;
            transition: .15s ease;
            padding: 5px;
            border-radius: 3px;
            box-sizing: border-box;
          
            &:hover {
              cursor: pointer;
              background-position: 100% 0;
              color: #fff;
              transform: scale(1.1);
            }
          
            &:focus {
              outline: none;
            }
          
            i {
              margin-${ this.state.position === HypedIconPosition.AFTER ? 'left' : 'right' }: 7.5px;
            }
          
            a {
              text-decoration: none;
              color: inherit;
            }
          }  
        `}</style>
      </>
    );
  }
}

export default HypedLink;
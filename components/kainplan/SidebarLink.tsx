import React from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

export interface SidebarLinkProps {
  icon: IconDefinition;
  title: string;
  href: string;
}

interface SidebarLinkState extends SidebarLinkProps {
}

class SidebarLink extends React.Component<SidebarLinkProps, SidebarLinkState> {
  constructor(props) {
    super(props);
    this.state = {
      icon: props.icon,
      title: props.title,
      href: props.href,
    };
  }

  render() {
    return (
      <>
        <Link href={this.state.href}>
          <a>
            <i>
              <FontAwesomeIcon icon={this.state.icon} />
            </i>
            <div>
              {this.state.title}
            </div>
          </a>
        </Link>
        <style jsx>{`
          a {
            text-decoration: none;
            color: #444;
            padding: 10px;
            display: flex;
            justify-content: stretch;
            align-items: center;
            transition: .3s ease;
            border-bottom: 1.5px solid #f2f2f2;

            & > i {
              margin-right: 5px;
            }

            & > div {
              flex-grow: 1;
              text-align: right;
            }

            &:hover {
              cursor: pointer;
              color: #622dff;
            }
          }
        `}</style>
      </>
    );
  }
}

export default SidebarLink;
import PropTypes from 'prop-types';
import React from 'react';

import Search from 'components/shared/search';

import { ChatWidgetTrigger } from '../chat-widget';

import Item from './item';

const Sidebar = ({ className = null, sidebar, currentSlug }) => (
  <aside className={className}>
    <Search className="z-30" />
    <ChatWidgetTrigger className="relative z-20 hidden xl:mt-6 xl:flex" />
    <nav className="relative z-20 mt-5 xl:mt-6">
      <ul>
        {sidebar.map((item, index) => (
          <Item {...item} currentSlug={currentSlug} key={index} />
        ))}
      </ul>
    </nav>
  </aside>
);

Sidebar.propTypes = {
  className: PropTypes.string,
  sidebar: PropTypes.arrayOf(
    PropTypes.exact({
      title: PropTypes.string.isRequired,
      slug: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.exact({
          title: PropTypes.string.isRequired,
          slug: PropTypes.string,
          items: PropTypes.arrayOf(
            PropTypes.exact({
              title: PropTypes.string.isRequired,
              slug: PropTypes.string,
              items: PropTypes.arrayOf(
                PropTypes.exact({
                  title: PropTypes.string,
                  slug: PropTypes.string,
                })
              ),
            })
          ),
        })
      ),
    })
  ).isRequired,
  currentSlug: PropTypes.string.isRequired,
};

export default Sidebar;

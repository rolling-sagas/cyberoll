import './column.css';

import PropTypes from 'prop-types';
import { Transition } from '@headlessui/react';

export default function Column({
  children,
  headerLeft,
  headerRight,
  headerCenter,
  afterLeave,
  show = true,
}) {
  console.log(111, headerCenter);
  return (
    <Transition show={show} afterLeave={afterLeave} appear={true}>
      <div className="column">
        <div className="column-header">
          <div className="left-corner">
            <div />
          </div>
          <div className="center">
            <div />
          </div>
          <div className="right-corner">
            <div />
          </div>
          <div className="header-grid">
            <div>{headerLeft}</div>
            <div>
              {typeof headerCenter === 'string' ? (
                <div className="text-ellipsis overflow-hidden whitespace-nowrap w-full text-center" title={headerCenter}>
                  {headerCenter}
                </div>
              ) : (
                { headerCenter }
              )}
            </div>
            <div>{headerRight}</div>
          </div>
        </div>
        <div className="column-content scrollbar-none">{children}</div>
      </div>
    </Transition>
  );
}

Column.propTypes = {
  children: PropTypes.node,
  headerLeft: PropTypes.node,
  headerRight: PropTypes.node,
  headerCenter: PropTypes.node,
};

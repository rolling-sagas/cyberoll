import "./column.css";

import PropTypes from "prop-types";

export default function Column({
  children,
  headerLeft,
  headerRight,
  headerCenter,
}) {
  return (
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
          <div>{headerCenter}</div>
          <div>{headerRight}</div>
        </div>
      </div>
      <div className="column-content">{children}</div>
    </div>
  );
}

Column.propTypes = {
  children: PropTypes.node,
  headerLeft: PropTypes.node,
  headerRight: PropTypes.node,
  headerCenter: PropTypes.node,
};

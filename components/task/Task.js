import PropTypes from "prop-types";

export default function Task({
  task: { id, title, state },
  onArchiveTask,
  onPinTask,
}) {
  return (
    <div className="list-item">
      <label htmlFor={`title-${id}`} aria-label={title}>
        <input
          type="text"
          value={title}
          readOnly={true}
          name="title"
          id={`title-${id}`}
        />
      </label>
    </div>
  );
}

Task.propTypes = {
  task: {
    /** Checks if it's in loading state */
    id: PropTypes.string,
    /** The list of tasks */
    title: PropTypes.string,
    /** The list of tasks */
    state: PropTypes.state,
    /** Event to change the task to pinned */
    onArchiveTask: PropTypes.func,
    /** Event to change the task to archived */
    onPinTask: PropTypes.func,
  },
};

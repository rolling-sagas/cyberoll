import MessagesView from '../messages/messages-view';

export default function SessionItem({ resetHandle }) {
  return (
    <MessagesView isSession={true} resetHandle={resetHandle} />
  );
}

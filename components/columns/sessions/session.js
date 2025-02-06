import MessagesView from '../messages/messages-view';

export default function SessionItem({ session }) {
  return (
    <MessagesView isSession={true} />
  );
}

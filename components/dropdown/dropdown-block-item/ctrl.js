import { BLOCK_TYPE } from '@/service/block';

const BlockMsg = {
  [BLOCK_TYPE.USER]: `won't be able to access your profile, view your comments, or seeing the stories you've created or played on Rolling Sagas. They won't be notified that you blocked them.`,
  [BLOCK_TYPE.STORY]: `won't be able to be seen by you.`,
};
const UnblockMsg = {
  [BLOCK_TYPE.USER]: `can access your profile, view your comments, or seeing the stories you've created or played on Rolling Sagas.`,
  [BLOCK_TYPE.STORY]: `can be seen by you.`,
};
function getMessage(type, blockedByMe, targetName) {
  return `${targetName} ${blockedByMe ? UnblockMsg[type] : BlockMsg[type]}`;
}

function getTitle(type, blockedByMe, targetName) {
  switch (type) {
    case BLOCK_TYPE.USER:
    case BLOCK_TYPE.STORY:
      return blockedByMe ? `Unblock ${targetName}?` : `Block ${targetName}?`;
    default:
      return blockedByMe ? 'Unblock' : 'Block';
  }
}

export { getMessage, getTitle };

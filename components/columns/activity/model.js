import { parseJson } from '@/utils/utils';

export function getText(data) {
  const extraInfo = parseJson(data.extraInfo, '');
  return extraInfo?.msg || '';
}

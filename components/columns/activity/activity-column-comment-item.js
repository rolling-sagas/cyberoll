import Avatar from '@/components/common/avatar';
import { getImageUrl } from '@/utils/utils';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import Image from '../../common/custom-image';

export function ActivityColumnCommentItem({ data }) {
  const router = useRouter();
  return (
    <div
      className="px-6 py-4 border-gray-200 bg-background hover:cursor-pointer hover:bg-rs-background-hover"
      onClick={() => {
        router.push(`/st/${data.story.id}`);
      }}
    >
      <div className="flex gap-x-[60px] items-center justify-between">
        <div className="flex gap-3 items-top">
          <Avatar
            className="cursor-pointer mt-1"
            image={data.user.image}
            size={40}
            name={data.user.name}
          />
          <div className="flex-1 min-w-0">
            <span className="text-base flex gap-1.5">
              <span className="font-semibold">{data.user.name}</span>
              <span className="text-zinc-400 font-light">
                {dayjs(data.createdAt).fromNow()}
              </span>
            </span>
            <p className="mt-1 text-foreground line-clamp-3 break-words">
              {/* TODO: 这里是否要支持富文本，比如@加粗这种 */}
              {data.comment?.content || ''}
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-top">
          <div className="w-10 h-10 rounded-md overflow-hidden">
            <Image
              src={getImageUrl(data.story.image)}
              width={40}
              height={40}
              alt={data.story.name}
              objectFit="cover"
              className="rounded-lg"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}

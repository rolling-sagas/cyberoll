import Avatar from '@/components/common/avatar';
import UserName from '@/components/common/user-name';
import { getImageUrl } from '@/utils/utils';
import dayjs from '@/utils/day';
import { useRouter } from 'next/navigation';
import Image from '../../common/custom-image';

function getCommentContent(content = '') {
  if (content.indexOf('commented') === 0) {
    return content;
  }
  return `commented: ${content}`;
}

export function ActivityColumnCommentItem({ data }) {
  const router = useRouter();
  return (
    <div
      className="px-6 py-4 border-gray-200 bg-background hover:cursor-pointer hover:bg-rs-background-hover"
      onClick={() => {
        router.push(`/st/${data.story.id}`);
      }}
    >
      <div className="flex gap-x-[60px] items-top justify-between">
        <div className="flex gap-3 items-top">
          <Avatar
            className="cursor-pointer mt-1"
            image={data.user.image}
            size={40}
            name={data.user.name}
            uid={data?.user?.id}
          />
          <div className="flex-1 min-w-0">
            <span className="text-base flex gap-1.5">
              <UserName
                name={data.user.name}
                uid={data?.user?.id}
                className="font-semibold cursor-pointer"
              />
              <span className="text-zinc-400 font-light">
                {dayjs(data.createdAt).fromNow()}
              </span>
            </span>
            <p className="mt-1 text-foreground line-clamp-2 break-words">
              {getCommentContent(data.comment?.content || '')}
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-top mt-1">
          <div className="w-[42px] h-[42px] rounded-md overflow-hidden">
            <Image
              src={getImageUrl(data.story.image)}
              width={42}
              height={42}
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

import Avatar from '@/components/common/avatar';
import { ACTIVITY_SUB_TYPE } from '@/utils/activity';
import { getImageUrl } from '@/utils/utils';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import Image from '../../common/custom-image';

export function ActivityColumnLikeItem({ data, subType }) {
  const router = useRouter();
  return (
    <div
      className="px-6 py-4 border-gray-200 bg-background hover:cursor-pointer hover:bg-rs-background-hover"
      onClick={() => {
        router.push(`/st/${data.story.id}`);
      }}
    >
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-3 items-center">
          <Avatar image={data.user.image} size={36} name={data.user.name} />
          <span className="flex flex-col">
            <span className="text-base flex gap-1.5">
              <span className="font-semibold">{data.user.name}</span>
              <span className="text-zinc-400 font-light">
                {dayjs(data.createdAt).fromNow()}
              </span>
            </span>
            <span className="">
              {subType === ACTIVITY_SUB_TYPE.Like && 'liked your story.'}
              {subType === ACTIVITY_SUB_TYPE.FirstPlayStory &&
                `${data.user.name} played ${data.story.name} for the first time.`}
              {subType === ACTIVITY_SUB_TYPE.PublishStory &&
                `${data.user.name} published a new story.`}
            </span>
          </span>
        </div>
        <div className="flex gap-2 items-center">
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

import Avatar from '@/components/common/avatar';
import UserName from '@/components/common/user-name';
import { ACTIVITY_SUB_TYPE } from '@/utils/activity';
import { getImageUrl } from '@/utils/utils';
import dayjs from '@/utils/day';
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
          <Avatar
            className="cursor-pointer mt-1"
            image={data.user.image}
            size={40}
            name={data.user.name}
            uid={data?.user?.id}
          />
          <span className="flex flex-col">
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
            <span>
              {subType === ACTIVITY_SUB_TYPE.Like && 'liked your story.'}
              {subType === ACTIVITY_SUB_TYPE.FirstPlayStory && (
                <span>
                  played <strong>{data.story.name}</strong> for the first time.
                </span>
              )}
              {subType === ACTIVITY_SUB_TYPE.PublishStory &&
                `published a new story.`}
            </span>
          </span>
        </div>
        <div className="flex gap-2 items-center">
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

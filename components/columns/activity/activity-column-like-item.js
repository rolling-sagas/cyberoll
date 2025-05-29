import Avatar from '@/components/common/avatar';
import UserName from '@/components/common/user-name';
import { ACTIVITY_SUB_TYPE } from '@/utils/activity';
import dayjs from '@/utils/day';
import { getImageUrl } from '@/utils/utils';
import { useRouter } from 'next/navigation';
import Image from '../../common/custom-image';
export function ActivityColumnLikeItem({ data, subType }) {
  const router = useRouter();
  const goProfile = (e) => {
    e?.stopPropagation();
    router.push(`/u/${data?.user?.id}`);
  };
  const goStory = () => {
    router.push(`/st/${data?.story?.slug || data?.story?.id}`);
  };
  return (
    <div className="px-6 py-4 border-gray-200 bg-background hover:bg-rs-background-hover">
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-3 items-center">
          <div onClick={(e) => goProfile(e)}>
            <Avatar
              className="cursor-pointer mt-1"
              image={data.user.image}
              size={40}
              name={data.user.name}
              uid={data?.user?.id}
            />
          </div>
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
            <span className="hover:cursor-pointer" onClick={goStory}>
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
        <div className="flex gap-2 items-center hover:cursor-pointer">
          <div
            className="w-[42px] h-[42px] rounded-md overflow-hidden"
            onClick={goStory}
          >
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

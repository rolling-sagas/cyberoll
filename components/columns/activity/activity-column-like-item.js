import Avatar from '@/components/common/avatar';
import { getImageUrl } from '@/utils/utils';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import Image from '../../common/custom-image';
// const mockData = {
//   user: {
//     id: 'cm42e1xom0000hl7qlk6ivc5f',
//     name: 'xiao',
//     image: '6cf470c7-1ffa-4d18-02cb-1c536436f400',
//     followers: [],
//   },
//   targetUser: {
//     id: 'cm9gtdx5t0000jyxr7tjs2ldf',
//     name: 'Alucard',
//     image:
//       'https://lh3.googleusercontent.com/a/ACg8ocIefMqmVRLlbVcm57hz6F0VYyerq4d3xPnTKvOBAmBA1yKdw9lZ=s96-c',
//   },
//   comment: null,
//   story: {
//     id: 'cm9hwkokr0001uj0mjvhbvcjy',
//     name: '道诡异仙',
//     image: '1bcd7d55-7368-48d9-fcd6-49e3ec6f9000',
//   },
//   type: 'social',
//   subType: 'like',
//   createdAt: '2025-04-16T08:23:44.179Z',
// };

export function ActivityColumnLikeItem({ data }) {
  const router = useRouter();
  return (
    // TODO: hover的时候，调整背景色
    <div
      className="px-6 py-4 border-gray-200 bg-background hover:cursor-pointer"
      onClick={() => {
        router.push(`/st/${data.story.id}`);
      }}
    >
      <div className="flex gap-2 items-center mb-3 justify-between">
        <div className="flex gap-3 items-center">
          <Avatar image={data.user.image} size={36} name={data.user.name} />
          <span className="flex flex-col">
            <span className="text-base flex gap-1.5">
              <span className="font-semibold">{data.user.name}</span>
              <span className="text-zinc-400 font-light">
                {dayjs(data.createdAt).fromNow()}
              </span>
            </span>
            <span className="">liked your story.</span>
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

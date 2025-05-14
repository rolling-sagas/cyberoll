import Image from '@/components/common/custom-image';
import { getImageUrl } from '@/utils/utils';
import { useRouter } from 'next/navigation';

export default function StoryList({ stories }) {
  const router = useRouter();
  return (
    <div>
      {(stories || [])
        .filter((s) => !s.keepPrivate)
        .map((story) => (
          <div
            key={story.id}
            className="py-4 border-gray-200 bg-background hover:cursor-pointer border-radius-md"
            onClick={() => {
              router.push(`/st/${story.id}`);
            }}
          >
            <div className="flex gap-2 items-start justify-between">
              <div className="flex gap-2 items-start">
                <div className="w-[50px] h-[50px] rounded-md overflow-hidden content-start">
                  <Image
                    src={getImageUrl(story.image)}
                    width={50}
                    height={50}
                    alt={story.name}
                    objectFit="cover"
                    className="rounded-lg"
                    priority
                  />
                </div>
              </div>
              <div className="flex gap-3 items-start px-2 border-b-1 border-gray-200 pb-4 grow">
                <span className="flex flex-col pb-1">
                  <span className="text-base flex gap-1.5 font-semibold mb-1">
                    {story.name}
                  </span>
                  <span className="line-clamp-3">{story.description}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

'use-client';

import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getPublicStories, getLikedStories } from "@/service/story";
import usePageData from "@/components/hooks/use-page-data";
import Link from "next/link";
import Image from "../../common/custom-image";
import { getImageUrl } from "@/utils/utils";
import PageDataStatus from "@/components/common/page-data-status";

export default function UserTabs({ uid }) {
  const [stories, storiesTotal, storiesLoading, _, hasMoreStory, loadmoreStories] = usePageData(getPublicStories, 9, 'stories')
  const [likes, likesTotal, likesLoading, __, hasMoreLikes, loadmoreLikes] = usePageData(getLikedStories, 9, 'stories')

  useEffect(() => {
    loadmoreStories(uid)
    loadmoreLikes(uid)
  }, [uid])

  return (
    <Tabs defaultValue="stories" className="w-full">
      <TabsList className="w-full bg-transparent border-b-1 rounded-none pb-0 gap-4">
        <TabsTrigger className="w-full border-b-1 data-[state=active]:border-foreground rounded-none !shadow-none mb-[-3px]" value="stories">Stories</TabsTrigger>
        <TabsTrigger className="w-full border-b-1 data-[state=active]:border-foreground rounded-none !shadow-none mb-[-3px]" value="likes">Likes</TabsTrigger>
      </TabsList>
      <TabsContent value="stories">
        <div className="flex gap-2 flex-wrap mb-2">
          {
            stories.map(s => <Link key={s.id} className="w-1/4 max-w-[33%] flex-grow" href={`/st/${s.id}`}>
              <Image
                src={getImageUrl(s.image)}
                width={310}
                height={310}
                objectFit="cover"
                alt={s.name}
                priority
              />
            </Link>)
          }
        </div>
        <PageDataStatus loading={storiesLoading} noData={storiesTotal === 0} loadMore={hasMoreStory} loadMoreHandle={() => loadmoreStories(uid)} />
      </TabsContent>
      <TabsContent value="likes">
      <div className="flex gap-2 flex-wrap mb-2">
          {
            likes.map(l => <Link key={l.story.id} className="w-1/4 max-w-[33%] flex-grow" href={`/st/${l.story.id}`}>
              <Image
                src={getImageUrl(l.story.image)}
                width={310}
                height={310}
                objectFit="cover"
                alt={l.story.name}
                priority
              />
            </Link>)
          }
        </div>
        <PageDataStatus loading={likesLoading} noData={likesTotal === 0} loadMore={hasMoreLikes} loadMoreHandle={() => loadmoreLikes(uid)} />
      </TabsContent>
    </Tabs>
  );
}

'use-client';

import { useState,useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getPublicStories, getLikedStories } from '@/service/story';
import usePageData from '@/components/hooks/use-page-data';
import Link from 'next/link';
import Image from '../../common/custom-image';
import { getImageUrl } from '@/utils/utils';
import PageDataStatus from '@/components/common/page-data-status';
import { Button } from '@/app/components/ui/button';
import { onCreateClick } from '../stories/story-action';
import { createSession } from '@/service/session';
import { useRouter } from 'next/navigation';

export default function UserTabs({ uid, isSelf = false }) {
  const [
    stories,
    storiesTotal,
    storiesLoading,
    _,
    hasMoreStory,
    loadmoreStories,
  ] = usePageData(getPublicStories, 9, 'stories');
  const router = useRouter();
  const [likes, likesTotal, likesLoading, __, hasMoreLikes, loadmoreLikes, ___, ____, pageData] =
    usePageData(getLikedStories, 9, 'stories');
  const [creatingSession, setCreatingSession] = useState(false)

  const play = useCallback(async () => {
      setCreatingSession(true);
      try {
        const seid = await createSession(pageData.randomSid);
        router.push(`/sess/${seid}`);
      } catch (e) {
        console.error(e);
        setCreatingSession(false);
      }
    }, [pageData]);

  useEffect(() => {
    loadmoreStories(uid);
    loadmoreLikes(uid);
  }, [uid]);

  return (
    <Tabs defaultValue="stories" className="w-full">
      <TabsList className="w-full bg-transparent border-b-1 rounded-none pb-0 gap-4">
        <TabsTrigger
          className="w-full border-b-1 data-[state=active]:border-foreground rounded-none !shadow-none mb-[-3px]"
          value="stories"
        >
          Stories
        </TabsTrigger>
        <TabsTrigger
          className="w-full border-b-1 data-[state=active]:border-foreground rounded-none !shadow-none mb-[-3px]"
          value="likes"
        >
          Likes
        </TabsTrigger>
      </TabsList>
      <TabsContent value="stories">
        <div className="flex gap-2 flex-wrap mb-2">
          {stories.map((s) => (
            <Link
              key={s.id}
              className="w-1/4 max-w-[33%] flex-grow -mb-1"
              href={`/st/${s.id}`}
            >
              <Image
                src={getImageUrl(s.image)}
                width={310}
                height={310}
                objectFit="cover"
                alt={s.name}
                priority
                className="!block"
              />
            </Link>
          ))}
          {new Array(stories.length % 3 > 0 ? 3 - (stories.length % 3) : 0)
            .fill('')
            .map((_, i) => (
              <span className="w-1/4 max-w-[33%] flex-grow -mb-1" key={i}>
                {' '}
              </span>
            ))}
        </div>
        <PageDataStatus
          loading={storiesLoading}
          noData={storiesTotal === 0}
          loadMore={hasMoreStory}
          loadMoreHandle={() => loadmoreStories(uid)}
          noDataComp={
            isSelf ? (
              <div className="py-10 text-center">
                <Button
                  className="rounded-xl"
                  variant="outline"
                  onClick={onCreateClick}
                >
                  Create your first story
                </Button>
              </div>
            ) : (
              <>No story created yet.</>
            )
          }
        />
      </TabsContent>
      <TabsContent value="likes">
        <div className="flex gap-2 flex-wrap mb-2">
          {likes.map((l) => (
            <Link
              key={l.story.id}
              className="w-1/4 max-w-[33%] flex-grow"
              href={`/st/${l.story.id}`}
            >
              <Image
                src={getImageUrl(l.story.image)}
                width={310}
                height={310}
                objectFit="cover"
                alt={l.story.name}
                priority
              />
            </Link>
          ))}
          {new Array(likes.length % 3 > 0 ? 3 - (likes.length % 3) : 0)
            .fill('')
            .map((_, i) => (
              <span className="w-1/4 max-w-[33%] flex-grow -mb-1" key={i}>
                {' '}
              </span>
            ))}
        </div>
        <PageDataStatus
          loading={likesLoading}
          noData={likesTotal === 0}
          loadMore={hasMoreLikes}
          loadMoreHandle={() => loadmoreLikes(uid)}
          noDataComp={
            isSelf && pageData?.randomSid ? (
              <div className="py-10 text-center">
                <Button
                  className="rounded-xl"
                  variant="outline"
                  onClick={play}
                  disabled={creatingSession}
                >
                  {creatingSession ? 'Starting...' : 'Quick start'}
                </Button>
              </div>
            ) : (
              <>No likes yet.</>
            )
          }
        />
      </TabsContent>
    </Tabs>
  );
}

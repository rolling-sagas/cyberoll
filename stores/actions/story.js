import useStore from "../editor";
import { getStory } from "@/service/story";
import { executeScript } from '@/stores/actions/game';

export const startViewingMessage = (message) =>
  useStore.setState(() => ({ viewingMessage: message }));

export const initStory = async (storyId) => {
  const story = await getStory(storyId, {
    script: true,
    components: true,
  })
  useStore.setState(() => ({
    script: story.script?.value || '',
    components: story.components || [],
  }))
  executeScript(true)
}

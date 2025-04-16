import useStore from "../editor";
import { getStory } from "@/service/story";
import { executeScript } from '@/stores/actions/game';

export const startViewingMessage = (message) =>
  useStore.setState(() => ({ viewingMessage: message }));

export const initStory = async (storyId) => {
  console.log(123)
  const story = await getStory(storyId, {
    script: true,
    components: true,
  })
  const {script, components = []} = story
  delete story.script
  delete story.components
  useStore.setState(() => ({
    story,
    script: script?.value || '',
    components: components,
  }))
  executeScript(true)
}

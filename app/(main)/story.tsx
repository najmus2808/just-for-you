import { Timeline } from '@/components/Timeline';
import { ScreenContainer } from '@/components/ScreenContainer';
import { getStoryTimeline } from '@/data/story';

export default function Story() {
  return (
    <ScreenContainer>
      <Timeline events={getStoryTimeline()} />
    </ScreenContainer>
  );
}

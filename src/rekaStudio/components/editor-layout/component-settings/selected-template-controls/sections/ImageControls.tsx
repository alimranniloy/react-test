import * as t from '@rekajs/types';

import { TemplateMediaFields } from '@app/components/editor-layout/shared/media/TemplateMediaFields';
import { ControlCard } from '../controls/ControlCard';

type ImageControlsProps = {
  template: t.TagTemplate;
};

export const ImageControls = (props: ImageControlsProps) => {
  if (props.template.tag !== 'img' && props.template.tag !== 'video') {
    return null;
  }

  return (
    <ControlCard
      eyebrow="Media"
      title={
        props.template.tag === 'video'
          ? 'Video source and playback'
          : 'Image source and fit'
      }
      description="Paste a link, upload to the media database, then adjust fit or playback without leaving the canvas."
    >
      <TemplateMediaFields template={props.template} variant="panel" />
    </ControlCard>
  );
};

import { Reka } from '@rekajs/core';
import * as t from '@rekajs/types';

import {
  UserFrame,
  UserFrameExtension,
} from '@app/extensions/UserFrameExtension';

type ExtensionBucket = {
  value?: {
    frames?: UserFrame[];
  } | null;
};

function getUserFrameBucket(reka: Reka) {
  const key = (UserFrameExtension as { key: string }).key;
  const extensions = reka.state.extensions as Record<string, ExtensionBucket>;

  return {
    key,
    extensions,
    bucket: extensions[key],
  };
}

export function readUserFrames(reka: Reka) {
  const extension = reka.getExtension(UserFrameExtension);
  const extensionFrames = (extension.state as { frames?: UserFrame[] } | undefined)
    ?.frames;

  if (Array.isArray(extensionFrames)) {
    return extensionFrames;
  }

  const { bucket } = getUserFrameBucket(reka);
  const bucketFrames = bucket?.value?.frames;

  return Array.isArray(bucketFrames) ? bucketFrames : [];
}

// Call this only in mutation/setup paths, never during render.
export function ensureUserFramesState(reka: Reka) {
  const extension = reka.getExtension(UserFrameExtension);
  const extensionState = extension.state as { frames?: UserFrame[] } | undefined;

  if (extensionState) {
    if (!Array.isArray(extensionState.frames)) {
      extensionState.frames = [];
    }

    const { key, extensions, bucket } = getUserFrameBucket(reka);
    if (!bucket) {
      extensions[key] = t.extensionState({
        value: {
          frames: extensionState.frames,
        },
      }) as ExtensionBucket;
    } else if (!bucket.value || typeof bucket.value !== 'object') {
      bucket.value = { frames: extensionState.frames };
    } else {
      bucket.value.frames = extensionState.frames;
    }

    return extensionState.frames;
  }

  const { key, extensions, bucket } = getUserFrameBucket(reka);

  if (!bucket) {
    extensions[key] = t.extensionState({
      value: {
        frames: [],
      },
    }) as ExtensionBucket;
    return (extensions[key].value?.frames ?? []) as UserFrame[];
  }

  if (!bucket.value || typeof bucket.value !== 'object') {
    bucket.value = {
      frames: [],
    };
    return bucket.value.frames ?? [];
  }

  if (!Array.isArray(bucket.value.frames)) {
    bucket.value.frames = [];
  }

  return bucket.value.frames;
}

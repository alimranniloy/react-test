import { createExtension } from '@rekajs/core';

export type UserFrame = {
  id: string;
  name: string;
  props?: Record<string, any>;
  width?: string;
  height?: string;
};

export type UserFrameExtensionState = {
  frames: UserFrame[];
};

export const UserFrameExtensionFactory = () => {
  return createExtension<UserFrameExtensionState>({
    key: 'user-frame-extension',
    state: {
      frames: [],
    },
    init: (ext) => {
      ext.subscribe(
        (state) => {
          return {
            frameProps: state.frames.reduce<
              Record<string, Record<string, any>>
            >(
              (accum, frame) => ({
                ...accum,
                [frame.id]: frame.props ?? {},
              }),
              {}
            ),
          };
        },
        (collected) => {
          Object.keys(collected.frameProps).forEach((key) => {
            const props = collected.frameProps[key];

            const stateFrame = ext.reka.frames.find(
              (frame) => frame.id === key
            );

            if (!stateFrame) {
              return;
            }

            stateFrame.setProps(props);
          });
        }
      );

      ext.subscribe(
        (state) => {
          return {
            frameCount: state.frames.length,
            frames: state.frames,
          };
        },
        (state, prevState) => {
          const currentFrames = state.frames;

          currentFrames.forEach((currentFrame) => {
            const stateFrame = ext.reka.frames.find(
              (frame) => frame.id === currentFrame.id
            );

            if (stateFrame) {
              return;
            }

            ext.reka.createFrame({
              id: currentFrame.id,
              component: {
                name: currentFrame.name,
                props: currentFrame.props,
              },
              syncImmediately: true,
            });
          });

          if (!prevState) {
            return;
          }

          if (prevState.frames.length <= currentFrames.length) {
            return;
          }

          const currentFrameIds = currentFrames.map((frame) => frame.id);
          const deletedFrames = prevState.frames.filter(
            (frame) => currentFrameIds.includes(frame.id) === false
          );

          deletedFrames.forEach((deletedFrame) => {
            const frame = ext.reka.frames.find(
              (frame) => frame.id === deletedFrame.id
            );

            if (!frame) {
              return;
            }

            ext.reka.removeFrame(frame);
          });
        },
        {
          fireImmediately: true,
        }
      );
    },
  });
};

export const UserFrameExtension = UserFrameExtensionFactory();

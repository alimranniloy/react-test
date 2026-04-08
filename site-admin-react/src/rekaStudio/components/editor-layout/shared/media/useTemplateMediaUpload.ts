import { useMutation } from '@apollo/client';
import * as React from 'react';

import {
  SELF_FILE_FILE_CREATE,
  SELF_FILE_FILE_CREATE_URL,
} from '@/graphql/mutations/file';
import { useToastStore } from '@/siteAdmin/store/useToastStore';
import { putWithProgress } from '@/siteAdmin/utils/upload';
import { useAuthStore } from '@/store/useAuthStore';

type UploadState = {
  isUploading: boolean;
  progress: number;
  bytesLabel: string;
};

const IMAGE_EXTENSIONS = new Set([
  'jpg',
  'jpeg',
  'png',
  'gif',
  'bmp',
  'svg',
  'webp',
  'avif',
]);

const VIDEO_EXTENSIONS = new Set([
  'mp4',
  'webm',
  'mov',
  'm4v',
  'ogg',
  'ogv',
]);

const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / 1024 ** exponent;

  return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${units[exponent]}`;
};

const getFileExtension = (filename: string) =>
  String(filename).split('.').pop()?.toLowerCase() ?? '';

const isImageFile = (file: File) =>
  file.type.startsWith('image/') || IMAGE_EXTENSIONS.has(getFileExtension(file.name));

const isVideoFile = (file: File) =>
  file.type.startsWith('video/') || VIDEO_EXTENSIONS.has(getFileExtension(file.name));

const createStorageKey = (file: File) => {
  const extension = getFileExtension(file.name) || 'bin';
  const bucket = isVideoFile(file) ? 'video' : 'image';
  const random = Math.random().toString(36).slice(2, 10);

  return `${bucket}/${Date.now()}-${random}.${extension}`;
};

export const useTemplateMediaUpload = () => {
  const user = useAuthStore((state) => state.user);
  const addToast = useToastStore((state) => state.addToast);
  const [state, setState] = React.useState<UploadState>({
    isUploading: false,
    progress: 0,
    bytesLabel: '',
  });

  const [getUploadUrl] = useMutation(SELF_FILE_FILE_CREATE_URL);
  const [createFile] = useMutation(SELF_FILE_FILE_CREATE);

  const uploadFile = React.useCallback(
    async (file: File) => {
      if (!user?.id) {
        addToast({
          kind: 'error',
          title: 'Media',
          subTitle: 'Login required before uploading media.',
        });
        return null;
      }

      const storageKey = createStorageKey(file);
      const mimeType = file.type || 'application/octet-stream';

      setState({ isUploading: true, progress: 0, bytesLabel: '' });

      try {
        if (!isImageFile(file)) {
          const uploadUrlResult = await getUploadUrl({
            variables: {
              userId: user.id,
              filename: storageKey,
            },
          });

          const signedUrl = uploadUrlResult.data?.selfFileFileCreateUrl;

          if (!signedUrl) {
            throw new Error('Upload URL not returned');
          }

          await putWithProgress(signedUrl, file, (progress) => {
            setState({
              isUploading: true,
              progress: progress.percent,
              bytesLabel: `${formatBytes(progress.loaded)} / ${formatBytes(
                progress.total
              )}`,
            });
          });
        }

        const createFileResult = await createFile({
          variables: {
            userId: user.id,
            file: isImageFile(file) ? file : null,
            mimeType,
            size: file.size,
            title: file.name,
            url: storageKey,
          },
        });

        const finalUrl =
          createFileResult.data?.selfFileFileCreate?.url || storageKey;

        setState({
          isUploading: false,
          progress: 100,
          bytesLabel: formatBytes(file.size),
        });

        addToast({
          kind: 'success',
          title: 'Media',
          subTitle: 'Uploaded and saved to media library.',
        });

        return finalUrl as string;
      } catch (error) {
        setState({ isUploading: false, progress: 0, bytesLabel: '' });
        addToast({
          kind: 'error',
          title: 'Media',
          subTitle: (error as Error).message,
        });
        return null;
      }
    },
    [addToast, createFile, getUploadUrl, user?.id]
  );

  const resetProgress = React.useCallback(() => {
    setState({ isUploading: false, progress: 0, bytesLabel: '' });
  }, []);

  return {
    uploadFile,
    resetProgress,
    ...state,
  };
};

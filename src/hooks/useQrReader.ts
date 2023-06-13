import {
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { Result } from '@zxing/library';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';

import { isMediaDevicesSupported, isValidType } from '../lib/utils';

type DecodeResult = Result | null | undefined;

interface UseQrReaderHookProps {
  /**
   * Media constraints object, to specify which camera and capabilities to use
   */
  constraints?: MediaTrackConstraints;
  /**
   * Callback for retrieving the result
   */
  onResult?: OnResultFunction;
  /**
   * Callback for retrieving the error
   */
  onError?: OnErrorFunction;
  /**
   * Property that represents the scan period
   */
  scanDelay?: number;
  /**
   * Property that represents the ID of the video element
   */
  videoId?: string;
}

interface UseQrReaderReturn {
  controls: IScannerControls | undefined;
  videoRef: RefObject<HTMLVideoElement> | undefined;
  // videoDevices: MediaDeviceInfo[];
}

type UseQrReaderHook = (props: UseQrReaderHookProps) => UseQrReaderReturn;

export type OnResultFunction = (result: DecodeResult) => void;
export type OnErrorFunction = (error: unknown) => void;

export const useQrReader: UseQrReaderHook = ({
  scanDelay: delayBetweenScanAttempts,
  constraints: video,
  onResult,
  onError,
}) => {
  const controlsRef: MutableRefObject<IScannerControls | undefined> = useRef();
  const videoRef = useRef<HTMLVideoElement>(null);

  const startScanner = useCallback(async () => {
    // const devices = await BrowserQRCodeReader.listVideoInputDevices();
    // const deviceId = devices[0]?.deviceId;
    // if (deviceId) return;
    if (videoRef.current == null) return;
    const reader = new BrowserQRCodeReader(undefined, {
      delayBetweenScanAttempts,
    });
    try {
      const controls = await reader.decodeFromConstraints(
        { video },
        videoRef.current,
        (result: DecodeResult) => {
          if (result) onResult?.(result);
        }
      );
      controlsRef.current = controls;
    } catch (e) {
      onError?.(e);
    }
  }, [delayBetweenScanAttempts, onError, onResult, video]);

  useEffect(() => {
    if (
      !isMediaDevicesSupported() &&
      isValidType(onResult, 'onResult', 'function')
    ) {
      const message =
        'MediaDevices API has no support for your browser. You can fix this by running "npm i webrtc-adapter"';

      onError?.(new Error(message));
    }
    startScanner();

    return () => controlsRef.current?.stop();
  }, [delayBetweenScanAttempts, onError, onResult, startScanner]);

  return {
    controls: controlsRef.current,
    videoRef: videoRef,
  };
};

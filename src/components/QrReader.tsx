import { CSSProperties, FC } from 'react';

import { styles } from '../lib/styles';
import { OnResultFunction, useQrReader } from '../hooks/useQrReader';

export interface QrReaderProps {
  /**
   * Media track constraints object, to specify which camera and capabilities to use
   */
  constraints?: MediaTrackConstraints;
  /**
   * Called when a result is found.
   */
  onResult?: OnResultFunction;
  /**
   * Called when an error occurs.
   */
  onError?: (error: Error) => void;
  /**
   * Property that represents the view finder component
   */
  ViewFinder?: FC;
  /**
   * Property that represents the scan period
   */
  scanDelay?: number;
  /**
   * Property that represents the ID of the video element
   */
  videoId?: string;
  /**
   * Property that represents an optional className to modify styles
   */
  className?: string;
  /**
   * Property that represents a style for the container
   */
  containerStyle?: CSSProperties;
  /**
   * Property that represents a style for the video container
   */
  videoContainerStyle?: CSSProperties;
  /**
   * Property that represents a style for the video
   */
  videoStyle?: CSSProperties;
}

export const QrReader: FC<QrReaderProps> = ({
  videoContainerStyle = {},
  containerStyle,
  videoStyle,
  constraints,
  ViewFinder,
  scanDelay,
  className,
  onResult,
  videoId,
}) => {
  const { controls, videoRef } = useQrReader({
    constraints,
    scanDelay,
    onResult,
    videoId,
  });

  return (
    <section className={className} style={containerStyle}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span>{String(controls)}</span>
      </div>
      <div
        style={{
          ...styles.container,
          ...videoContainerStyle,
        }}
      >
        {!!ViewFinder && <ViewFinder />}
        <video
          muted
          id={videoId}
          ref={videoRef}
          style={{
            ...styles.video,
            ...videoStyle,
            transform: constraints?.facingMode === 'user' ? 'scaleX(-1)' : '',
          }}
        />
      </div>
    </section>
  );
};

QrReader.displayName = 'QrReader';
QrReader.defaultProps = {
  constraints: {
    facingMode: 'environment',
  },
  videoId: 'video',
  scanDelay: 500,
};

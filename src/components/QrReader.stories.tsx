import { useState } from 'react';
import { StoryFn } from '@storybook/react';

import { ViewFinder } from './ViewFinder';
import { QrReader } from '..';
import { QrReaderProps } from './QrReader';

const styles = {
  container: {
    width: '400px',
    margin: 'auto',
  },
};

const Template: StoryFn<QrReaderProps> = (args) => {
  const [error, setError] = useState('');
  const [data, setData] = useState('');

  return (
    <div style={styles.container}>
      <QrReader
        {...args}
        onResult={(result) => setData(result?.getText() ?? 'No result')}
        onError={(err) => setError(err.message)}
      />
      <p>The value is: {JSON.stringify(data, null, 2)}</p>
      <p>The error is: {error}</p>
    </div>
  );
};

export const ScanCode = Template.bind({});

ScanCode.args = {
  ViewFinder,
  videoId: 'video',
  scanDelay: 500,
  constraints: {
    facingMode: 'user',
  },
};

export default {
  title: 'Browser QR Reader',
  component: QrReader,
};

import { Meta, StoryFn } from '@storybook/react';
import { ComponentProps } from 'react';

import { ViewFinder } from './ViewFinder';

export default {
  component: ViewFinder,
} as Meta<typeof ViewFinder>;

export const Default: StoryFn<ComponentProps<typeof ViewFinder>> = () => (
  <ViewFinder />
);

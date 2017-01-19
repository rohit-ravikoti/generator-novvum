import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { <%= componentName %> } from '~/';

storiesOf('<%= componentName %>')
  .add('default view', () => {
    return (
      <<%= componentName %> />
    );
  });

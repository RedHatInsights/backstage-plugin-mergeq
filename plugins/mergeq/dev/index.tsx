import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { mergeqPlugin, MergeqPage } from '../src/plugin';

createDevApp()
  .registerPlugin(mergeqPlugin)
  .addPage({
    element: <MergeqPage />,
    title: 'Root Page',
    path: '/mergeq',
  })
  .render();

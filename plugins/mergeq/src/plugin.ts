import {
  createPlugin,
  createComponentExtension,
} from '@backstage/core-plugin-api';

export const mergeqPlugin = createPlugin({
  id: 'mergeq',
});

export const EntityMergeqContent = mergeqPlugin.provide(
  createComponentExtension({
    name: 'EntityMergeqContent',
    component: {
      lazy: () => import('./components/MergeQComponent').then(m => m.MergeQComponent),
    },
  }),
);

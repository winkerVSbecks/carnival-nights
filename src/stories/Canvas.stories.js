import Canvas from '../Canvas.svelte';

export default {
  title: 'Confetti',
  component: Canvas,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    particleCount: {
      control: { type: 'range', min: 0, max: 200, step: 1 },
    },
    radiusRatio: {
      control: { type: 'range', min: 1, max: 20, step: 1 },
    },
    velocityFactor: {
      control: { type: 'range', min: 1, max: 100, step: 1 },
    },
    decay: {
      control: { type: 'range', min: 0.5, max: 1, step: 0.01 },
      value: 0.94,
    },
    gravity: {
      control: { type: 'range', min: 0, max: 10, step: 1 },
    },
  },
};

const Template = ({ onClick, ...args }) => ({
  Component: Canvas,
  props: args,
});

export const Playground = Template.bind({});
Playground.args = {
  particleCount: 90,
  radiusRatio: 8,
  velocityFactor: 75,
  decay: 0.94,
  gravity: 3,
};

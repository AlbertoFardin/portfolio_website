import * as React from 'react';
import { version } from '../../version.json';
import Background from './Background';

const Story = () => {
  localStorage.clear();
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Background />
      <div
        style={{
          height: 90,
          textAlign: 'center',
          color: '#fff',
          margin: 'auto',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
      >
        Alberto Fardin
        <p
          style={{ fontFamily: 'monospace', letterSpacing: 3 }}
          children={`Portfolio ${version}`}
        />
      </div>
    </div>
  );
};

export default { title: `Intro/Portfolio ${version}` };
export const Welcome = Story.bind({});

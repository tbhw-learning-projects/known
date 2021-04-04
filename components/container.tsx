import React from 'react';
import { Pane } from 'evergreen-ui';

interface ContainerProps {
  children: React.ReactNode;
  styles: string[];
}

const Container = ({ children, ...styles }: ContainerProps): JSX.Element => (
  <Pane maxWidth="960px" marginX="auto" width="100%" {...styles}>
    {children}
  </Pane>
);

export default Container;

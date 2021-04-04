import React, { PropsWithChildren } from 'react';
import { Pane } from 'evergreen-ui';

interface ContainerProps {
  [style: string]: string | React.ReactNode;
}

const Container = ({ children, ...styles }: PropsWithChildren<ContainerProps>): JSX.Element => (
  <Pane maxWidth="960px" marginX="auto" width="100%" {...styles}>
    {children}
  </Pane>
);

export default Container;

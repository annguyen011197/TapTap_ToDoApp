import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import Flex, {FlexProps} from './Flex';

export interface RowProps extends FlexProps {
  isReverse?: boolean;
}

const Row = React.forwardRef<View, RowProps>((props, ref) => {
  const style: StyleProp<ViewStyle> = StyleSheet.flatten([
    {
      flex: props.flex || 1,
      flexDirection: props.isReverse ? 'row-reverse' : 'row',
    },
    props.style,
  ]);
  return (
    <Flex ref={ref} style={style}>
      {props.children}
    </Flex>
  );
});

export default Row;

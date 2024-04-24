import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import Flex, {FlexProps} from './Flex';

interface Props extends FlexProps {
  isReverse?: boolean;
}

const Col = React.forwardRef<View, Props>((props, ref) => {
  const style: StyleProp<ViewStyle> = StyleSheet.flatten([
    {
      flex: props.flex || 1,
      flexDirection: props.isReverse ? 'column-reverse' : 'column',
    },
    props.style,
  ]);
  return (
    <Flex ref={ref} style={style}>
      {props.children}
    </Flex>
  );
});

export default Col;

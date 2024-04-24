import React from 'react';
import {StyleProp, StyleSheet, View, ViewProps, ViewStyle} from 'react-native';

export interface FlexProps extends ViewProps {
  flex?: number;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Flex = React.forwardRef<View, FlexProps>((props: FlexProps, ref) => {
  const style = StyleSheet.flatten([{flex: props.flex || 1}, props.style]);
  return (
    <View style={style} {...props} ref={ref}>
      {props.children}
    </View>
  );
});

export default Flex;

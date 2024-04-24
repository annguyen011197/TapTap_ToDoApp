import {View} from 'react-native';
import React from 'react';

const Spacer = (props: {width?: number; height?: number}) => {
  const style = {
    width: props.width,
    height: props.height,
    backgroundColor: 'transparent',
  };
  return <View style={style} />;
};

export default Spacer;

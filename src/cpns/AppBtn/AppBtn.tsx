import React from 'react';
import {StyleSheet, Text, TouchableOpacity, ViewProps} from 'react-native';

interface Props extends ViewProps {
  title: String;
  onPress?: () => void;
}
const AppBtn = ({title, onPress, style: pStyle}: Props) => {
  const viewStyle = StyleSheet.flatten([style.button, pStyle]);
  console.log('Render AppBtn ' + title);
  return (
    <TouchableOpacity style={viewStyle} onPress={onPress}>
      <Text style={style.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  button: {
    backgroundColor: '#21AB3B',
    borderRadius: 20,
    paddingHorizontal: 27,
    paddingVertical: 8,
    justifyContent: 'center',
    alignContent: 'center',
  },
  text: {
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default AppBtn;

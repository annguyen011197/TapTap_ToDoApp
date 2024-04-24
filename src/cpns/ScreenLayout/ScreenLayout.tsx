import React from 'react';
import {
  SafeAreaView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Flex from '../Flex/Flex';
import style from './style';

interface Props {
  children?: React.ReactNode;
  titleView?: React.ReactNode;
  title?: String;
  titleStyle?: StyleProp<TextStyle>;
  backgroundStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}
const ScreenLayout = (props: Props) => {
  const {defaultAppBar, defaultScreen, flex1} = style;
  const backgroundStyle = StyleSheet.flatten([
    defaultScreen,
    props.backgroundStyle,
  ]);
  return (
    <Flex style={backgroundStyle}>
      <SafeAreaView style={flex1}>
        <View style={defaultAppBar}>{renderTitle(props)}</View>
        <Flex style={props.contentStyle}>{props.children}</Flex>
      </SafeAreaView>
    </Flex>
  );
};

const renderTitle = (props: Props) => {
  const {defaultTitle} = style;

  if (props.titleView) {
    return props.titleView;
  }
  const tilteStyle = StyleSheet.flatten([defaultTitle, props.titleStyle]);
  if (props.title) {
    return <Text style={tilteStyle}>{props.title}</Text>;
  }
  return <View />;
};

export default ScreenLayout;

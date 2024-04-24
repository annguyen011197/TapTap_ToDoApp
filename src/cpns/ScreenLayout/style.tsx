import {StyleSheet} from 'react-native';

const DEFAULT_APPBAR_HEIGHT = 56;

const style = StyleSheet.create({
  defaultTitle: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
  },
  defaultAppBar: {
    height: DEFAULT_APPBAR_HEIGHT,
    backgroundColor: 'transparent',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  defaultScreen: {
    backgroundColor: 'green',
    flex: 1,
  },

  flex1: {
    flex: 1,
  },
});

export default style;

//import liraries
import dayjs from 'dayjs';
import React, {useImperativeHandle, useMemo} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import Animated, {
  AnimatedRef,
  runOnJS,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Priority} from '../../models/Note';
import Col from '../Flex/Col';
import Flex from '../Flex/Flex';
import Row from '../Flex/Row';
import {INoteProps} from '../props/prop';

export interface NoteType {
  title: AnimatedRef<any>;
  animateHide(
    targetTitlePosition: {
      position: {x: number; y: number};
      scale?: {x: number; y: number};
    },
    callback?: () => void,
  ): void;
  animateShow(): void;
}

interface NoteProps extends ViewProps, INoteProps {
  onEditRequest: () => void;
}

const PriorityText = ({value}: {value: Priority}) => {
  switch (value) {
    case Priority.High:
      return <Text style={styles.hightText}>Ưu tiên cao</Text>;
    case Priority.Med:
      return <Text style={styles.medText}>Ưu tiên trung bình</Text>;
    case Priority.Low:
      return <Text style={styles.lowText}>Ưu tiên thấp</Text>;
  }
};

const DuoDateText = ({value}: {value: Date}) => {
  const diff = useMemo(() => {
    const date1 = dayjs(value);
    const date2 = dayjs(Date());
    return date1.diff(date2, 'day');
  }, [value]);
  return <Text style={styles.duodate}>{`Còn ${diff} ngày`}</Text>;
};

const NoteLayout = React.forwardRef<NoteType, NoteProps>((props, ref) => {
  const {data} = props;
  const basePosition = {x: 60, y: 24};
  //   const basePosition = {x: 0, y: 0};
  const titleRef = useAnimatedRef();
  const titleOpacity = useSharedValue(1);
  const containerOpacity = useSharedValue(1);

  const posX = useSharedValue(basePosition.x);
  const posY = useSharedValue(basePosition.y);

  const titleStyle = useAnimatedStyle(() => ({
    flex: 1,
    opacity: titleOpacity.value,
    position: 'absolute',
    top: posY.value,
    left: posX.value,
  }));

  useImperativeHandle(ref, () => ({
    title: titleRef,
    animateHide(targetPosition, callback = () => {}) {
      console.log(`Target layout ${JSON.stringify(targetPosition)}`);
      posX.value = withTiming(
        targetPosition.position.x,
        {duration: 500},
        () => {
          titleOpacity.value = 0;
          runOnJS(callback)();
        },
      );
      posY.value = withTiming(targetPosition.position.y, {duration: 500});
      containerOpacity.value = withTiming(0);
    },
    animateShow() {
      posX.value = withTiming(basePosition.x);
      posY.value = withTiming(basePosition.y);
      containerOpacity.value = withTiming(1, {duration: 300});
      titleOpacity.value = 1;
    },
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  return (
    <Animated.View style={styles.container}>
      <Animated.View style={containerStyle}>
        <Row style={StyleSheet.flatten([styles.contentHolder])}>
          <View style={styles.squareItem} />
          <Col>
            <Row style={styles.titleAndEdit}>
              <Flex></Flex>
              <TouchableOpacity onPress={props.onEditRequest}>
                <Image
                  style={styles.icon}
                  source={require('../../assets/images/pen.png')}
                />
              </TouchableOpacity>
            </Row>
            <Row style={styles.priorityAndDate}>
              <Flex>
                <PriorityText value={data.priority} />
              </Flex>
              <DuoDateText value={data.expiration} />
            </Row>
          </Col>
        </Row>
      </Animated.View>

      <Animated.View ref={titleRef} style={titleStyle}>
        <Text numberOfLines={1} style={styles.title}>
          {data.content}
        </Text>
      </Animated.View>
    </Animated.View>
  );
});

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentHolder: {
    gap: 20,
    marginStart: 18,
    marginEnd: 24,
    marginVertical: 24,
    opacity: 1,
  },
  titleAndEdit: {
    justifyContent: 'space-between',
    gap: 20,
  },
  priorityAndDate: {
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 20,
  },
  title: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
    flex: 1,
  },
  icon: {
    width: 37,
    height: 37,
  },
  priority: {
    fontSize: 12,
    flex: 1,
  },
  duodate: {
    fontSize: 10,
    color: '#000000',
  },
  hightText: {
    color: '#21AB3B',
    fontSize: 12,
  },
  medText: {
    color: '#F2994A',
    fontSize: 12,
  },
  lowText: {
    color: 'yellow',
    fontSize: 12,
  },
  squareItem: {
    width: 22,
    height: 22,
    backgroundColor: 'gray',
    marginTop: 4,
    borderRadius: 4,
  },
});

//make this component available to the app
export default NoteLayout;

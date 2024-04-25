//import liraries
import dayjs from 'dayjs';
import React, {useImperativeHandle, useMemo, useRef} from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
  useAnimatedValue,
} from 'react-native';
import {Priority} from '../../models/Note';
import {useAnimationValueXY} from '../../utils/utils';
import Col from '../Flex/Col';
import Flex from '../Flex/Flex';
import Row from '../Flex/Row';
import {INoteProps} from '../props/prop';

export interface NoteType {
  title: React.RefObject<any>;
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
  const title = useRef(null);

  const titleOpacity = useAnimatedValue(1);
  const containerOpacity = useAnimatedValue(1);

  const pos = useAnimationValueXY();

  // const posX = useAnimatedValue(basePosition.x);
  // const posY = useAnimatedValue(basePosition.y);

  useImperativeHandle(ref, () => ({
    title,
    animateHide(targetPosition, callback = () => {}) {
      Animated.sequence([
        Animated.timing(pos, {
          toValue: {
            x: targetPosition.position.x,
            y: targetPosition.position.y,
          },
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(containerOpacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(callback);
    },
    animateShow() {
      Animated.parallel([
        Animated.timing(pos, {
          toValue: {
            x: 0,
            y: 0,
          },
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(containerOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    },
  }));

  const containerStyle = useMemo(
    () => ({
      opacity: containerOpacity,
    }),
    [containerOpacity],
  );

  const titleStyle = useMemo(
    () => ({
      flex: 1,
      opacity: titleOpacity,
      transform: [{translateX: pos.x}, {translateY: pos.y}],
    }),
    [pos.x, pos.y, titleOpacity],
  );

  return (
    <Animated.View style={styles.container}>
      <Animated.View style={containerStyle}>
        <Row style={StyleSheet.flatten([styles.contentHolder])}>
          <View style={styles.squareItem} />
          <Col>
            <Row style={styles.titleAndEdit}>
              <Animated.View style={titleStyle}>
                <Text numberOfLines={1} style={styles.title} ref={title}>
                  {data.content}
                </Text>
              </Animated.View>
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

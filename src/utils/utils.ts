import {Animated, findNodeHandle} from 'react-native';
import {Position} from '../models/Position';
import {Size} from '../models/Size';
import {DependencyList, EffectCallback, useEffect, useRef} from 'react';

const delay = (time: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, time));
};

const asyncMeasureLayout = async (
  containerRef?: React.RefObject<any>,
  noteInputRef?: React.RefObject<any>,
): Promise<{position: Position; size: Size}> =>
  new Promise((resolve, reject) => {
    if (!containerRef?.current || !noteInputRef?.current) {
      reject();
      return;
    }
    const handler = findNodeHandle(containerRef.current);
    if (!handler) {
      reject();
      return;
    }
    noteInputRef.current.measureLayout(
      handler,
      (x: number, y: number, width: number, height: number) => {
        resolve({position: {x, y}, size: {width: width, height: height}});
      },
    );
  });

const useAnimationValueXY = () => {
  const value = useRef(new Animated.ValueXY());
  return value.current;
};
const useEffectAfterMount = (
  cb: EffectCallback,
  dependencies: DependencyList | undefined,
) => {
  const mounted = useRef(true);

  useEffect(() => {
    if (!mounted.current) {
      return cb();
    }
    mounted.current = false;
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
};

export {delay, asyncMeasureLayout, useAnimationValueXY, useEffectAfterMount};

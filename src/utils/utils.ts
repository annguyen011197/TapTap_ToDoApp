import {findNodeHandle} from 'react-native';
import {Position} from '../models/Position';
import {Size} from '../models/Size';

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

export {delay, asyncMeasureLayout};

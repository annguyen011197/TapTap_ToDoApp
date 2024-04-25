import {useCallback, useRef} from 'react';
import {Animated, View, useAnimatedValue} from 'react-native';
import {NoteInputType} from '../../../cpns/NoteInputLayout/NoteInputLayout';
import {NoteType} from '../../../cpns/NoteLayout/NoteLayout';
import {asyncMeasureLayout, delay} from '../../../utils/utils';

const useAnimationHandler = () => {
  const noteInputRef = useRef<NoteInputType>(null);
  const containerRef = useRef<View>(null);
  const noteViewerRef = useRef<NoteType>(null);
  const heightViewer = useRef(0);
  const heightInput = useRef(0);
  const height = useAnimatedValue(150);

  const updateViewerHeight = useCallback(
    (value: number) => {
      // heightViewer.setValue(value);
      heightViewer.current = value;
    },
    [heightViewer],
  );

  const updateInputHeight = useCallback(
    (value: number) => {
      // heightInput.setValue(value);
      heightInput.current = value;
    },
    [heightInput],
  );

  const triggerExpand = useCallback(() => {
    const execution = async () => {
      var appTextInput = noteInputRef.current?.appTextInput;
      const targetLayout = await asyncMeasureLayout(containerRef, appTextInput);
      const currentLayout = await asyncMeasureLayout(
        containerRef,
        noteViewerRef.current?.title,
      );
      const newPosition = {
        x: targetLayout.position.x - currentLayout.position.x,
        y: targetLayout.position.y - currentLayout.position.y,
      };

      Animated.timing(height, {
        toValue: heightInput.current,
        duration: 300,
        useNativeDriver: false,
      }).start();

      noteViewerRef.current?.animateHide({
        position: newPosition,
      });
      await delay(400);
      noteInputRef.current?.animateShow();
    };
    execution().catch(e => console.error(e));
  }, [height]);

  const triggerCollapse = useCallback(() => {
    const execution = async () => {
      noteInputRef.current?.animateHide();
      await delay(300);
      Animated.timing(height, {
        toValue: heightViewer.current,
        duration: 300,
        useNativeDriver: false,
      }).start();

      noteViewerRef.current?.animateShow();
    };
    execution().catch(e => console.error(e));
  }, [height]);

  return {
    noteInputRef,
    containerRef,
    noteViewerRef,
    height,
    updateViewerHeight,
    updateInputHeight,
    triggerExpand,
    triggerCollapse,
  };
};

export default useAnimationHandler;

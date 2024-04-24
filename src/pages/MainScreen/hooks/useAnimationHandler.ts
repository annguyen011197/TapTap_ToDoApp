import {useCallback, useRef} from 'react';
import {useDerivedValue, useSharedValue} from 'react-native-reanimated';
import {asyncMeasureLayout, delay} from '../../../utils/utils';
import {NoteInputType} from '../../../cpns/NoteInputLayout/NoteInputLayout';
import {View} from 'react-native';
import {NoteType} from '../../../cpns/NoteLayout/NoteLayout';

const useAnimationHandler = (isEdit: boolean) => {
  const noteInputRef = useRef<NoteInputType>(null);
  const containerRef = useRef<View>(null);
  const noteViewerRef = useRef<NoteType>(null);
  const heightViewer = useSharedValue(0);
  const heightInput = useSharedValue(0);
  const height = useDerivedValue(() => {
    return isEdit ? heightInput.value : heightViewer.value;
  });

  const updateViewerHeight = useCallback(
    (value: number) => {
      heightViewer.value = value;
    },
    [heightViewer],
  );

  const updateInputHeight = useCallback(
    (value: number) => {
      heightInput.value = value;
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
        x: targetLayout.position.x,
        y:
          targetLayout.position.y +
          (targetLayout.size.height - currentLayout.size.height) / 2,
      };

      noteViewerRef.current?.animateHide({
        position: newPosition,
      });
      await delay(300);
      noteInputRef.current?.animateShow();
    };
    execution();
  }, []);

  const triggerCollapse = useCallback(() => {
    const execution = async () => {
      noteViewerRef.current?.animateShow();

      noteInputRef.current?.animateHide();
    };
    execution();
  }, []);

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

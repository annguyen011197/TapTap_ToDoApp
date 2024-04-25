import React, {memo, useCallback} from 'react';
import {Animated, LayoutChangeEvent, StyleSheet, View} from 'react-native';
import {BSON} from 'realm';
import NoteInputLayout from '../../cpns/NoteInputLayout/NoteInputLayout';
import NoteLayout from '../../cpns/NoteLayout/NoteLayout';
import {INote} from '../../models/Note';
import {useEffectAfterMount} from '../../utils/utils';
import {useNoteInput} from './hooks/hook';
import useAnimationHandler from './hooks/useAnimationHandler';
import useExpandCollapse from './hooks/useExpandCollapse';
const NoteLayoutWrapper = ({data}: {data: BSON.ObjectId}) => {
  const {writeData, deleteData, note} = useNoteInput(data);
  const {isEdit, handle, layoutComplete} = useExpandCollapse(data);
  const {
    height,
    noteInputRef,
    containerRef,
    noteViewerRef,
    triggerExpand,
    triggerCollapse,
    updateViewerHeight,
    updateInputHeight,
  } = useAnimationHandler();

  useEffectAfterMount(() => {
    if (isEdit) {
      triggerExpand();
    } else {
      triggerCollapse();
    }
  }, [isEdit, triggerCollapse, triggerExpand]);

  const onLayout = useCallback(
    (ev: LayoutChangeEvent) => {
      updateViewerHeight(ev.nativeEvent.layout.height);
    },
    [updateViewerHeight],
  );

  const onLayoutInput = useCallback(
    (ev: LayoutChangeEvent) => {
      updateInputHeight(ev.nativeEvent.layout.height);
      layoutComplete.current = true;
    },
    [layoutComplete, updateInputHeight],
  );

  const onDoneEdit = useCallback(
    (newValue: INote) => {
      writeData(newValue);
      handle();
    },
    [handle, writeData],
  );

  const onDelete = useCallback(() => {
    deleteData();
  }, [deleteData]);
  if (!note) {
    return <View />;
  }

  const style = StyleSheet.flatten([
    styles.container,
    {
      height: height,
    },
  ]);

  return (
    <Animated.View style={style} ref={containerRef}>
      <View
        style={styles.wrapper}
        onLayout={onLayoutInput}
        pointerEvents={isEdit ? 'auto' : 'none'}>
        <NoteInputLayout
          ref={noteInputRef}
          data={note}
          onDone={onDoneEdit}
          onDelete={onDelete}
        />
      </View>
      <View
        style={styles.wrapper}
        onLayout={onLayout}
        pointerEvents={isEdit ? 'none' : 'auto'}>
        <NoteLayout ref={noteViewerRef} data={note} onEditRequest={handle} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    flex: 1,
  },
});

export default memo(NoteLayoutWrapper, (prev, next) => {
  const areEqual = prev.data.equals(next.data);
  return areEqual;
});

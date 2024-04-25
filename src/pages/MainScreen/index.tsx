import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  ListRenderItem,
  ListRenderItemInfo,
  StyleSheet,
} from 'react-native';
import {BSON} from 'realm';
import AppBtn from '../../cpns/AppBtn/AppBtn';
import ScreenLayout from '../../cpns/ScreenLayout/ScreenLayout';
import Spacer from '../../cpns/Spacer/Spacer';
import {Priority} from '../../models/Note';
import NoteLayoutWrapper from './NoteLayoutWrapper';
import {useMainList} from './hooks/hook';
import {EditContext} from './hooks/useEditContext';
import Col from '../../cpns/Flex/Col';
import {delay} from '../../utils/utils';

const MainScreen = () => {
  const [listData, addNewData] = useMainList();
  const listRef = useRef<FlatList>(null);
  const onPress = useCallback(
    () =>
      (async () => {
        const length = listData.length;
        const id = addNewData({
          priority: Priority.Low,
          content: `Task ${length + 1}`,
          expiration: new Date(),
        });
        await delay(500);
        setEditId(id);
      })(),
    [addNewData, listData.length],
  );

  const renderItem: ListRenderItem<BSON.ObjectId> = useCallback(
    (item: ListRenderItemInfo<BSON.ObjectId>) => {
      return (
        <Col>
          <NoteLayoutWrapper data={item.item} />
          <Spacer height={24} />
        </Col>
      );
    },
    [],
  );
  const listValue = useMemo(() => {
    return listData.map(item => item._id);
  }, [listData]);

  const [editId, setEditId] = useState<BSON.ObjectId | undefined>(undefined);

  const value = useMemo(
    () => ({state: {id: editId}, action: {onNewEdit: setEditId}}),
    [editId],
  );

  const listItemMemo = useMemo(() => {
    return (
      <FlatList
        ref={listRef}
        data={listValue}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContent}
        style={styles.flatList}
      />
    );
  }, [listValue, renderItem]);

  return (
    <ScreenLayout
      titleStyle={styles.title}
      title={'To-do list'}
      backgroundStyle={styles.main}
      contentStyle={styles.content}>
      <EditContext.Provider value={value}>
        {listItemMemo}
        <AppBtn
          title={'Tạo task mới +'}
          onPress={onPress}
          style={styles.button}
        />
      </EditContext.Provider>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#F7CC15',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  content: {padding: 24, flex: 1},
  button: {
    backgroundColor: '#F65D79',
    paddingVertical: 14,
    borderRadius: 24,
  },
  flatListContent: {paddingBottom: 24},
  flatList: {marginBottom: 24},
});

export default MainScreen;

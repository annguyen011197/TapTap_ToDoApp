import useStorage from '../../../services/useStorage';
import {INote, Note} from '../../../models/Note';
import {BSON} from 'realm';
import {useObject, useRealm} from '@realm/react';

const useMainList = () => {
  const {highPriorityList: listData, writeData} = useStorage();

  const addNewData = (note: INote): BSON.ObjectId => writeData(note);

  return [listData, addNewData] as const;
};

const useNoteInput = (value: BSON.ObjectId) => {
  const realm = useRealm();
  const note = useObject(Note, value);

  const writeData = (newValue: INote) => {
    realm.write(() => {
      if (note) {
        note.content = newValue.content;
        note.expiration = newValue.expiration;
        note.priority = newValue.priority;
      }
    });
  };
  const deleteData = () => {
    realm.write(() => {
      console.log('delete ' + note?._id);
      realm.delete(note);
    });
  };

  return {writeData, deleteData, note};
};

export {useMainList, useNoteInput};

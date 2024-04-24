import {useQuery, useRealm} from '@realm/react';
import {INote, Note} from '../models/Note';
import {BSON} from 'realm';

const useStorage = () => {
  const realm = useRealm();
  const listData = useQuery(Note, notes => notes);
  const highPriorityList = useQuery(
    Note,
    notes => notes.sorted('priority', true),
    [],
  );
  const writeData = (note: INote): BSON.ObjectId => {
    const id = realm.write(() => {
      const newNote = realm.create('Note', {
        ...note,
        _id: new BSON.ObjectId(),
      });
      return newNote._id;
    });
    return id;
  };
  return {listData, highPriorityList, writeData};
};

export default useStorage;

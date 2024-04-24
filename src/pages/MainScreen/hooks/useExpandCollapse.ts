import {useCallback, useEffect, useState} from 'react';
import useEditContext from './useEditContext';
import {BSON} from 'realm';

const useExpandCollapse = (data: BSON.ObjectId) => {
  const {id: editId, onNewEdit} = useEditContext();
  const [isEdit, setIsEdit] = useState(false);

  const handle = useCallback((): boolean => {
    const newValue = !isEdit;
    setIsEdit(newValue);
    onNewEdit(newValue ? data : undefined);
    return newValue;
  }, [data, isEdit, onNewEdit]);

  useEffect(() => {
    if (editId === undefined) {
      return;
    }
    if ((editId.equals(data) && !isEdit) || (!editId.equals(data) && isEdit)) {
      handle();
      return;
    }
  }, [data, editId, handle, isEdit]);

  return [isEdit, handle] as const;
};

export default useExpandCollapse;

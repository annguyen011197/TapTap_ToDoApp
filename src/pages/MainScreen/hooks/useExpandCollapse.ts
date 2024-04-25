import {useCallback, useRef, useState} from 'react';
import {BSON} from 'realm';
import {useEffectAfterMount} from '../../../utils/utils';
import useEditContext from './useEditContext';

const useExpandCollapse = (data: BSON.ObjectId) => {
  const {id: editId, onNewEdit} = useEditContext();
  const layoutComplete = useRef(false);
  const [isEdit, setIsEdit] = useState(false);

  const handle = useCallback((): boolean => {
    const newValue = !isEdit;
    setIsEdit(newValue);
    onNewEdit(newValue ? data : undefined);
    return newValue;
  }, [data, isEdit, onNewEdit]);

  useEffectAfterMount(() => {
    if (editId === undefined) {
      return;
    }
    if ((editId.equals(data) && !isEdit) || (!editId.equals(data) && isEdit)) {
      handle();
      return;
    }
  }, [data, editId, handle, isEdit]);

  return {isEdit, handle, layoutComplete};
};

export default useExpandCollapse;

import React, {useCallback, useMemo} from 'react';
import {BSON} from 'realm';

interface EditState {
  id?: BSON.ObjectId;
}

interface EditAction {
  onNewEdit: (id?: BSON.ObjectId) => void;
}

const EditContext = React.createContext<{
  state: EditState;
  action: EditAction;
} | null>(null);

const useEditContext = () => {
  const context = React.useContext(EditContext);
  if (!context) {
    throw new Error('Context not found');
  }
  const {state, action} = context;

  const onNewEdit = useCallback(
    (id?: BSON.ObjectId) => action.onNewEdit(id),
    [action],
  );
  const id = useMemo(() => state.id, [state.id]);

  return {onNewEdit, id};
};

export default useEditContext;
export {EditContext};
export type {EditState, EditAction};

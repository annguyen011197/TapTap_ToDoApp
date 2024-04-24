import 'react-native-get-random-values';
import {BSON, Object, ObjectSchema} from 'realm';

enum Priority {
  Low,
  Med,
  High,
}
interface INote {
  priority: Priority;
  content: string;
  expiration: Date;
}
export class Note
  extends Object<Note, 'priority' | 'content' | 'expiration'>
  implements INote
{
  _id: BSON.ObjectId = new BSON.ObjectId();
  priority!: Priority;
  content!: string;
  expiration!: Date;

  static schema: ObjectSchema = {
    name: 'Note',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      priority: 'int',
      content: 'string',
      expiration: 'date',
    },
  };
}

export {Priority, type INote};

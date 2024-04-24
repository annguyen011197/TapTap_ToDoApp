import dayjs from 'dayjs';
import React, {
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import RNPickerSelect from 'react-native-picker-select';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {INote, Priority} from '../../models/Note';
import AppBtn from '../AppBtn/AppBtn';
import Col from '../Flex/Col';
import Row from '../Flex/Row';
import {INoteProps} from '../props/prop';

export interface NoteInputType {
  appTextInput: React.RefObject<View>;
  animateShow(): void;
  animateHide(): void;
}

interface NoteProps {
  onDone: (value: INote) => void;
  onDelete: () => void;
}

interface InputState {
  form: {
    content: string;
    date: Date;
    priority: Priority;
  };
  setForm: (form: InputState['form']) => void;
}
const InputContext = React.createContext<InputState | null>(null);

const NoteInputLayout = React.forwardRef<
  NoteInputType,
  NoteProps & ViewProps & INoteProps
>((props, ref) => {
  const {data} = props;

  const [form, setForm] = useState<InputState['form']>({
    content: data.content,
    date: data.expiration,
    priority: data.priority,
  });
  const textInput = useRef<View>(null);
  const opacity = useSharedValue(0);
  useImperativeHandle(ref, () => ({
    appTextInput: textInput,
    animateShow: () => {
      console.log('animateShow');
      opacity.value = withTiming(1);
    },
    animateHide: () => {
      opacity.value = withTiming(0);
    },
  }));

  const animateStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    console.log(`Form change ${JSON.stringify(form)}`);
  }, [form]);

  const onDone = useCallback(() => {
    props.onDone({
      content: form.content,
      expiration: form.date,
      priority: form.priority,
    });
  }, [form.content, form.date, form.priority, props]);

  return (
    <Animated.View style={animateStyle}>
      <InputContext.Provider value={{form, setForm}}>
        <Col style={styles.container}>
          <View style={styles.deleteArea}>
            <Pressable onPress={props.onDelete}>
              <Row style={styles.deleteArea}>
                <Image
                  style={styles.icon}
                  source={require('../../assets/images/Delete.png')}
                  resizeMethod="auto"
                  resizeMode="contain"
                />
                <Text>Xóa</Text>
              </Row>
            </Pressable>
          </View>
          <AppTextInput ref={textInput} />
          <Row style={styles.infoLayout}>
            <Text style={styles.propertyTitle}>Thời hạn</Text>
            <DateTimeSelect />
          </Row>
          <Seperator />
          <Row style={styles.infoLayout}>
            <Text style={styles.propertyTitle}>Mực độ ưu tiên</Text>
            <PrioritySelect />
          </Row>
          <Seperator />
          <View style={{alignItems: 'center', marginTop: 22}}>
            <AppBtn title={'Xong'} onPress={onDone} style={styles.button} />
          </View>
        </Col>
      </InputContext.Provider>
    </Animated.View>
  );
});

const Seperator = () => <View style={styles.seperator} />;

const AppTextInput = React.forwardRef<View, {}>((props, ref) => {
  const context = useContext<InputState | null>(InputContext);
  if (!context) {
    throw new Error('Context not found');
  }
  const {form, setForm} = context;
  const [isFocus, setIsFocus] = React.useState(false);
  const seperatorStyle = useMemo(
    () =>
      StyleSheet.flatten([
        styles.seperator,
        isFocus ? styles.unfocusSeperator : null,
      ]),
    [isFocus],
  );
  const changeFocus = useCallback(
    (newValue: boolean) => () => setIsFocus(newValue),
    [],
  );
  const changeValue = useCallback(
    (value: string) => {
      setForm({...form, content: value});
    },
    [form, setForm],
  );

  return (
    <View>
      <View ref={ref}>
        <TextInput
          defaultValue={form.content}
          onFocus={changeFocus(true)}
          onBlur={changeFocus(false)}
          style={styles.propertyTitle}
          onChangeText={changeValue}
        />
      </View>

      <View style={seperatorStyle} />
    </View>
  );
});

const DateTimeSelect = () => {
  const context = useContext(InputContext);
  if (!context) {
    throw new Error('Context not found');
  }
  const {form, setForm} = context;
  const [open, setOpen] = useState(false);

  const triggerOpen = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const onConfirm = useCallback(
    (date: Date) => {
      setOpen(false);
      setForm({...form, date: date});
    },
    [form, setForm],
  );

  const dateStr = useMemo(() => {
    return dayjs(form.date).format('DD/MM/YYYY');
  }, [form.date]);
  return (
    <TouchableOpacity onPress={triggerOpen}>
      <DatePicker
        modal
        date={form.date}
        open={open}
        onCancel={triggerOpen}
        onConfirm={onConfirm}
        minimumDate={new Date()}
        mode="date"
      />
      <Text>{dateStr}</Text>
    </TouchableOpacity>
  );
};

const PrioritySelect = () => {
  const context = useContext(InputContext);
  if (!context) {
    throw new Error('Context not found');
  }
  const {form, setForm} = context;
  const picker = useRef<RNPickerSelect>(null);
  const changeValue = useCallback(
    (value: Priority) => {
      setForm({...form, priority: value});
    },
    [form, setForm],
  );
  return (
    <RNPickerSelect
      ref={picker}
      useNativeAndroidPickerStyle={false}
      fixAndroidTouchableBug={true}
      items={[
        {label: 'Cao', value: Priority.High, key: 1},
        {label: 'Trung bình', value: Priority.Med, key: 2},
        {label: 'Thấp', value: Priority.Low, key: 3},
      ]}
      style={{viewContainer: {height: 0}}}
      onValueChange={changeValue}
      value={form.priority}
    />
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  icon: {
    height: 16,
    width: 16,
  },
  deleteArea: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 4,
  },
  seperator: {
    height: 1,
    backgroundColor: '#DADADA',
  },
  unfocusSeperator: {
    backgroundColor: '#1A1818',
  },
  infoLayout: {
    justifyContent: 'space-between',
    paddingBottom: 8,
    paddingTop: 22,
  },
  propertyTitle: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
    padding: 0,
  },
  button: {
    backgroundColor: '#21AB3B',
  },
});

export default NoteInputLayout;

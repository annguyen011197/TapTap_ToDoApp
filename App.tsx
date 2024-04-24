/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {RealmProvider} from '@realm/react';
import React from 'react';

import {Note} from './src/models/Note';
import MainScreen from './src/pages/MainScreen';

function App(): React.JSX.Element {
  return (
    <RealmProvider schema={[Note]}>
      <MainScreen />
    </RealmProvider>
  );
}

export default App;

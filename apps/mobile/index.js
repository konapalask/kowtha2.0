/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import CodePush from '@revopush/react-native-code-push';
import App from './App';
import {name as appName} from './app.json';

// Configure CodePush options
const codePushOptions = {
  // Check for updates every time the app resumes (enabled in debug for QA)
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,

  // Install updates immediately (with dialog)
  installMode: CodePush.InstallMode.IMMEDIATE,

  // Show custom dialog for updates - user gets informed but cannot reject
  updateDialog: {
    title: 'Update Available',
    optionalUpdateMessage:
      'An update is available. The app will restart after updating.',
    optionalInstallButtonLabel: 'Update Now',
    mandatoryUpdateMessage: 'An update is available and must be installed.',
    mandatoryContinueButtonLabel: 'Restart the application',
  },

  // Use Android deployment key from strings.xml
  deploymentKey: Platform.select({
    android: 'BYneeFfgIcFbUCkZyuEzSzr0ZjUuN1gf9oHafg',
    ios: null, // iOS not in scope for this project
  }),
};

// Wrap App component with CodePush
const CodePushApp = CodePush(codePushOptions)(App);

AppRegistry.registerComponent(appName, () => CodePushApp);

import {AppRegistry, Platform} from 'react-native';
import CodePush from '@revopush/react-native-code-push';
import App from './App';
import {name as appName} from './app.json';

const isDev = __DEV__;
const appEnv = (process.env && process.env.REACT_APP_ENV) || undefined;

let RootComponent = App;

// Wrap with CodePush only when not in development and not in production env
if (!isDev && appEnv !== 'production') {
  const codePushOptions = {
    checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
    installMode: CodePush.InstallMode.IMMEDIATE,
    updateDialog: {
      title: 'Update Available',
      optionalUpdateMessage:
        'An update is available. The app will restart after updating.',
      optionalInstallButtonLabel: 'Update Now',
      mandatoryUpdateMessage: 'An update is available and must be installed.',
      mandatoryContinueButtonLabel: 'Restart the application',
    },
    deploymentKey: Platform.select({
      android: 'BYneeFfgIcFbUCkZyuEzSzr0ZjUuN1gf9oHafg',
      ios: null,
    }),
  };

  RootComponent = CodePush(codePushOptions)(App);
}

AppRegistry.registerComponent(appName, () => RootComponent);

import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import {Linking} from 'react-native';
import notifee from '@notifee/react-native';
import NotificationSounds from 'react-native-notification-sounds';

const DisplayNotification = async data => {
  const clickActionUrl = data?.notification?.android?.clickAction;
  await notifee.requestPermission();
  const soundsList = await NotificationSounds.getNotifications('notification');
  const channelId = await notifee.createChannel({
    id: 'custom-sound',
    name: 'System Sound',
    sound: soundsList[0].url,
    vibration: true,
    vibrationPattern: [300, 500],
  });

  // Define the action to open the link
  const openLinkAction = {
    title: 'Open Link',
    pressAction: {
      id: 'openLink',
      url: clickActionUrl,
    },
  };
  notifee.onForegroundEvent(({type, detail}) => {
    if (type === EventType.ACTION_PRESS && detail.pressAction.id) {
      Linking.openURL(clickActionUrl);
    }
  });

  await notifee.displayNotification({
    title: data.notification.title,
    body: data.notification.body,
    android: {
      smallIcon: 'finallogo',
      largeIcon: require('./src/assets/finallogo.png'),
      timestamp: data.sentTime,
      showTimestamp: true,
      channelId,
      actions: [openLinkAction],
    },
  });
};

notifee.onBackgroundEvent(async ({type, detail}) => {
  if (type === EventType.ACTION_PRESS && detail.pressAction.id === 'openLink') {
    Linking.openURL(detail.pressAction.url);
  }
});

// Handle background messages
messaging().setBackgroundMessageHandler(async remoteMessage => {
  DisplayNotification(remoteMessage);
});

// Handle initial notification
messaging()
  .getInitialNotification()
  .then(async remoteMessage => {
    if (remoteMessage) {
      DisplayNotification(remoteMessage);
    }
  });

AppRegistry.registerComponent(appName, () => App);

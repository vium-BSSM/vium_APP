import { Alert as NativeAlert, AlertButton, Platform } from 'react-native';

const alert = (title: string, message?: string, buttons?: AlertButton[]) => {
  if (Platform.OS !== 'web') {
    NativeAlert.alert(title, message, buttons);
    return;
  }

  const text = message ? `${title}\n\n${message}` : title;

  if (!buttons || buttons.length <= 1) {
    window.alert(text);
    buttons?.[0]?.onPress?.();
    return;
  }

  const cancelButton = buttons.find((button) => button.style === 'cancel');
  const confirmButton = buttons.find((button) => button.style !== 'cancel');

  if (window.confirm(text)) {
    confirmButton?.onPress?.();
  } else {
    cancelButton?.onPress?.();
  }
};

export const Alert = { alert };

import { Alert as NativeAlert, AlertButton, Platform } from 'react-native';

/**
 * react-native의 Alert와 같은 사용법.
 * react-native-web의 Alert.alert는 아무 동작도 하지 않아(빈 함수) 웹에서는 브라우저 기본 alert/confirm으로 대신 표시
 * - 버튼이 1개 이하: alert 후 해당 버튼의 onPress 실행
 * - 버튼이 2개 이상: confirm → 확인은 취소가 아닌 첫 번째 버튼, 취소는 cancel 버튼의 onPress 실행
 */
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

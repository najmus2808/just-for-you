export type AlertButtonStyle = 'default' | 'cancel' | 'destructive';

export type AlertButton = {
  text: string;
  style?: AlertButtonStyle;
  onPress?: () => void;
};

export type AlertRequest = {
  title: string;
  message?: string;
  buttons: AlertButton[];
};

type Listener = (request: AlertRequest | null) => void;

let listener: Listener | null = null;

/** Wires the on-screen AlertHost (mounted once, in app/_layout.tsx) up to receive requests. */
export function subscribeToAlerts(next: Listener): () => void {
  listener = next;
  return () => {
    if (listener === next) {
      listener = null;
    }
  };
}

/**
 * A themed, in-app replacement for `Alert.alert` — used everywhere instead.
 * Two reasons: `Alert.alert` is a silent no-op on web (react-native-web
 * ships an empty stub, so confirms/errors did nothing in a browser), and a
 * plain OS dialog box looks out of place next to the rest of this app.
 */
export function showAlert(title: string, message?: string, buttons?: AlertButton[]): void {
  const resolvedButtons = buttons && buttons.length > 0 ? buttons : [{ text: 'OK' }];
  listener?.({ title, message, buttons: resolvedButtons });
}

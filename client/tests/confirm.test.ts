// Tests confirmAction on both native (Alert.alert) and web (window.confirm),
// since Alert buttons do nothing on react-native-web.
import { Alert, Platform } from 'react-native';

import { confirmAction } from '@/utils/confirm';

type AlertButton = { text: string; style?: string; onPress?: () => void };

afterEach(() => {
  jest.restoreAllMocks();
});

describe('confirmAction on native', () => {
  beforeEach(() => {
    jest.replaceProperty(Platform, 'OS', 'ios');
  });

  it('shows an alert with Cancel and a destructive confirm button', () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    confirmAction({ title: 'Delete?', message: 'This cannot be undone.', onConfirm: jest.fn() });

    expect(alertSpy).toHaveBeenCalledTimes(1);
    const [title, message, buttons] = alertSpy.mock.calls[0] as [string, string, AlertButton[]];
    expect(title).toBe('Delete?');
    expect(message).toBe('This cannot be undone.');
    expect(buttons.map((button) => button.text)).toEqual(['Cancel', 'Confirm']);
    expect(buttons[0].style).toBe('cancel');
    expect(buttons[1].style).toBe('destructive');
  });

  it('uses a custom label and the default style when not destructive', () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    confirmAction({
      title: 'Log out?',
      message: 'You can sign back in any time.',
      confirmLabel: 'Log out',
      destructive: false,
      onConfirm: jest.fn(),
    });

    const buttons = alertSpy.mock.calls[0][2] as AlertButton[];
    expect(buttons[1]).toEqual(expect.objectContaining({ text: 'Log out', style: 'default' }));
  });

  it('only runs onConfirm when the confirm button is pressed', () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const onConfirm = jest.fn();

    confirmAction({ title: 'Delete?', message: '...', onConfirm });
    expect(onConfirm).not.toHaveBeenCalled();

    const buttons = alertSpy.mock.calls[0][2] as AlertButton[];
    buttons[1].onPress?.();
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});

describe('confirmAction on web', () => {
  const originalConfirm = globalThis.confirm;

  beforeEach(() => {
    jest.replaceProperty(Platform, 'OS', 'web');
  });

  afterEach(() => {
    globalThis.confirm = originalConfirm;
  });

  it('runs onConfirm when the browser dialog is accepted', () => {
    const confirmMock = jest.fn().mockReturnValue(true);
    globalThis.confirm = confirmMock;
    const onConfirm = jest.fn();

    confirmAction({ title: 'Delete?', message: 'Gone forever.', onConfirm });

    expect(confirmMock).toHaveBeenCalledWith('Delete?\n\nGone forever.');
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('does nothing when the browser dialog is cancelled', () => {
    globalThis.confirm = jest.fn().mockReturnValue(false);
    const onConfirm = jest.fn();

    confirmAction({ title: 'Delete?', message: '...', onConfirm });

    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('never falls back to Alert.alert on web', () => {
    globalThis.confirm = jest.fn().mockReturnValue(false);
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    confirmAction({ title: 'Delete?', message: '...', onConfirm: jest.fn() });

    expect(alertSpy).not.toHaveBeenCalled();
  });
});

import { Linking } from 'react-native';

import {
  defaultOriginWhitelist,
  createOnShouldStartLoadWithRequest,
} from '../WebViewShared';

describe('WebViewShared', () => {
  test('exports defaultOriginWhitelist', () => {
    expect(defaultOriginWhitelist).toMatchSnapshot();
  });

  describe('createOnShouldStartLoadWithRequest', () => {
    const alwaysTrueOnShouldStartLoadWithRequest = (nativeEvent) => {
      return true;
    };

    const alwaysFalseOnShouldStartLoadWithRequest = (nativeEvent) => {
      return false;
    };

    const loadRequest = jest.fn();

    test('loadRequest is called without onShouldStartLoadWithRequest override', () => {
      const onShouldStartLoadWithRequest = createOnShouldStartLoadWithRequest(
        loadRequest,
        defaultOriginWhitelist,
      );

      onShouldStartLoadWithRequest({ nativeEvent: { url: 'https://www.google.com/', lockIdentifier: 1 } });
      expect(Linking.openURL).toHaveBeenCalledTimes(0);
      expect(loadRequest).toHaveBeenCalledWith(true, 'https://www.google.com/', 1);
    });

    test('Linking.openURL is called without onShouldStartLoadWithRequest override', () => {
      const onShouldStartLoadWithRequest = createOnShouldStartLoadWithRequest(
        loadRequest,
        defaultOriginWhitelist,
      );

      onShouldStartLoadWithRequest({ nativeEvent: { url: 'invalid://example.com/', lockIdentifier: 2 } });
      expect(Linking.openURL).toHaveBeenCalledWith('invalid://example.com/');
      expect(loadRequest).toHaveBeenCalledWith(false, 'invalid://example.com/', 2);
    });

    test('loadRequest with true onShouldStartLoadWithRequest override is called', () => {
      const onShouldStartLoadWithRequest = createOnShouldStartLoadWithRequest(
        loadRequest,
        defaultOriginWhitelist,
        alwaysTrueOnShouldStartLoadWithRequest,
      );

      onShouldStartLoadWithRequest({ nativeEvent: { url: 'https://www.google.com/', lockIdentifier: 1 } });
      expect(Linking.openURL).toHaveBeenCalledTimes(0);
      expect(loadRequest).toHaveBeenLastCalledWith(true, 'https://www.google.com/', 1);
    });

    test('Linking.openURL with true onShouldStartLoadWithRequest override is called for links not passing the whitelist', () => {
      const onShouldStartLoadWithRequest = createOnShouldStartLoadWithRequest(
        loadRequest,
        defaultOriginWhitelist,
        alwaysTrueOnShouldStartLoadWithRequest,
      );

      onShouldStartLoadWithRequest({ nativeEvent: { url: 'invalid://example.com/', lockIdentifier: 1 } });
      expect(Linking.openURL).toHaveBeenLastCalledWith('invalid://example.com/');
      expect(loadRequest).toHaveBeenLastCalledWith(true, 'invalid://example.com/', 1);
    });

    test('loadRequest with false onShouldStartLoadWithRequest override is called', () => {
      const onShouldStartLoadWithRequest = createOnShouldStartLoadWithRequest(
        loadRequest,
        defaultOriginWhitelist,
        alwaysFalseOnShouldStartLoadWithRequest,
      );

      onShouldStartLoadWithRequest({ nativeEvent: { url: 'https://www.google.com/', lockIdentifier: 1 } });
      expect(Linking.openURL).toHaveBeenCalledTimes(0);
      expect(loadRequest).toHaveBeenLastCalledWith(false, 'https://www.google.com/', 1);
    });

    test('loadRequest with limited whitelist', () => {
      const onShouldStartLoadWithRequest = createOnShouldStartLoadWithRequest(
        loadRequest,
        ['https://*'],
      );

      onShouldStartLoadWithRequest({ nativeEvent: { url: 'https://www.google.com/', lockIdentifier: 1 } });
      expect(Linking.openURL).toHaveBeenCalledTimes(0);
      expect(loadRequest).toHaveBeenLastCalledWith(true, 'https://www.google.com/', 1);

      onShouldStartLoadWithRequest({ nativeEvent: { url: 'http://insecure.com/', lockIdentifier: 2 } });
      expect(Linking.openURL).toHaveBeenLastCalledWith('http://insecure.com/');
      expect(loadRequest).toHaveBeenLastCalledWith(false, 'http://insecure.com/', 2);

      onShouldStartLoadWithRequest({ nativeEvent: { url: 'git+http://insecure.com/', lockIdentifier: 3 } });
      expect(Linking.openURL).toHaveBeenLastCalledWith('git+http://insecure.com/');
      expect(loadRequest).toHaveBeenLastCalledWith(false, 'git+http://insecure.com/', 3);
    });
  });
});

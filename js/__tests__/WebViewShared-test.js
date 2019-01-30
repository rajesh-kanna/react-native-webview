import {
  defaultOriginWhitelist,
  createOnShouldStartLoadWithRequest,
} from '../WebViewShared';

describe('WebViewShared', () => {
  test('exports defaultOriginWhitelist', () => {
    expect(defaultOriginWhitelist).toMatchSnapshot();
  });

  describe('createOnShouldStartLoadWithRequest', () => {
    function onShouldStartLoadWithRequestCallback(shouldStart: boolean, url: string, lockIdentifier: number) {

    }

    test('loadRequest is called', () => {
      const onShouldStartLoadWithRequest = createOnShouldStartLoadWithRequest(
        onShouldStartLoadWithRequestCallback,
        defaultOriginWhitelist,
        jest.fn()
      );
    });
  });
});

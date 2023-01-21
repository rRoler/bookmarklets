const checkSite = (): boolean => /bookwalker.jp/.test(window.location.hostname);

export { checkSite };

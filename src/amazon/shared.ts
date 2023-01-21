const checkSite = (): boolean => /www.amazon.*/.test(window.location.hostname);

export { checkSite };

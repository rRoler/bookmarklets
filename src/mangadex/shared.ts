const checkSite = (): boolean => /mangadex\..*/.test(window.location.hostname);

export { checkSite };

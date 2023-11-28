import * as utils from '../utils';

const newBookmarklet = (code: VoidFunction): void => {
	utils.newBookmarklet('www.amazon.*', code);
};

export { newBookmarklet };

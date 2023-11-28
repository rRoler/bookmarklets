import * as utils from '../utils';

const newBookmarklet = (code: VoidFunction): void => {
	utils.newBookmarklet('bookwalker.jp', code);
};

export { newBookmarklet };

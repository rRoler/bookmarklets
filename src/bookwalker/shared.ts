import * as BM from '../shared';

const newBookmarklet = (code: VoidFunction): void => {
	BM.newBookmarklet('bookwalker.jp', code);
};

export { newBookmarklet };

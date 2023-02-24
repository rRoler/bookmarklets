import * as BM from '../shared';

const newBookmarklet = (code: VoidFunction): void => {
	BM.newBookmarklet('www.amazon.*', code);
};

export { newBookmarklet };

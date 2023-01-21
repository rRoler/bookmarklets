module.exports = function bookmarklet(
	options = {
		iife: true,
		prefix: true,
		urlEncode: true,
	}
) {
	return {
		name: 'bookmarklet',
		renderChunk: (code) => {
			const specialCharacters = [
				'%',
				'"',
				'<',
				'>',
				'#',
				'@',
				' ',
				'\\&',
				'\\?',
			];
			const iife = (code) => `void function(){${code}}();`;
			const prefix = (code) => `javascript:${code}`;
			const urlEncode = (code) =>
				code.replace(
					new RegExp(specialCharacters.join('|'), 'g'),
					encodeURIComponent
				);
			let bookmarklet = code;
			if (options.iife) bookmarklet = iife(bookmarklet);
			if (options.prefix) bookmarklet = prefix(bookmarklet);
			if (options.urlEncode) bookmarklet = urlEncode(bookmarklet);
			return {
				code: bookmarklet,
			};
		},
	};
};

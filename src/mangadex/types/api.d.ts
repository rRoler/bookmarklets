export type Status = 'ongoing' | 'completed' | 'hiatus' | 'cancelled';

export type PublicationDemographic =
	| 'shounen'
	| 'shoujo'
	| 'josei'
	| 'seinen'
	| 'none';

export type ContentRating = 'safe' | 'suggestive' | 'erotica' | 'pornographic';

export interface LocalisedStringObject {
	[key: string]: string;
}

export interface Relationship {
	id: string;
	type: string;
	related?: string;
	attributes?: unknown;
}

export interface Tag {
	id: string;
	type: 'tag';
	attributes: {
		name: LocalisedStringObject;
		description: Array<LocalisedStringObject>;
		group: string;
		version: number;
	};
	relationships: Array<Relationship>;
}

export type State = 'draft' | 'submitted' | 'published' | 'rejected';

export interface MangaType {
	id: string;
	type: 'manga';
	attributes: {
		title: LocalisedStringObject;
		altTitles: Array<LocalisedStringObject>;
		description: Array<LocalisedStringObject>;
		isLocked: boolean;
		links: Array<LocalisedStringObject>;
		originalLanguage: string;
		lastVolume: string;
		lastChapter: string;
		publicationDemographic: PublicationDemographic;
		status: Status;
		year: number;
		contentRating: ContentRating;
		tags: Array<Tag>;
		state: State;
		chapterNumbersResetOnNewVolume: boolean;
		createdAt: string;
		updatedAt: string;
		version: number;
		availableTranslatedLanguages: Array<string | null>;
	};
	relationships: Array<Relationship>;
}

export interface MangaQueryResponse {
	result: 'ok';
	response: 'collection';
	data: Array<MangaType>;
	limit: number;
	offset: number;
	total: number;
}

interface CoverType {
	id: string;
	type: 'cover_art';
	attributes: {
		volume: string | null;
		fileName: string;
		description: string | null;
		locale: string | null;
		createdAt: string;
		updatedAt: string;
		version: number;
	};
	relationships: Array<Relationship>;
}

interface CoverListQueryResponse {
	result: 'ok';
	response: 'collection';
	data: Array<CoverType>;
	limit: number;
	offset: number;
	total: number;
}

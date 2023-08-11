type Status = 'ongoing' | 'completed' | 'hiatus' | 'cancelled';

type PublicationDemographic =
	| 'shounen'
	| 'shoujo'
	| 'josei'
	| 'seinen'
	| 'none';

type ContentRating = 'safe' | 'suggestive' | 'erotica' | 'pornographic';

interface LocalisedStringObject {
	[key: string]: string;
}

interface Relationship {
	id: string;
	type: string;
	related?: string;
	attributes?: unknown;
}

interface Tag {
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

type State = 'draft' | 'submitted' | 'published' | 'rejected';

interface MangaType {
	id: string;
	type: 'manga';
	attributes: {
		title: LocalisedStringObject;
		altTitles: Array<LocalisedStringObject>;
		description: Array<LocalisedStringObject>;
		isLocked: boolean;
		links: LocalisedStringObject;
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

interface MangaResponse {
	result: 'ok';
	response: 'entity';
	data: MangaType;
}

interface MangaListResponse {
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

interface CoverListResponse {
	result: 'ok';
	response: 'collection';
	data: Array<CoverType>;
	limit: number;
	offset: number;
	total: number;
}

export {
	Status,
	PublicationDemographic,
	ContentRating,
	LocalisedStringObject,
	Relationship,
	Tag,
	State,
	MangaType,
	MangaResponse,
	MangaListResponse,
	CoverType,
	CoverListResponse,
};

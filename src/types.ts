
export interface Peli {
    id: number;
    title?: string;
    name?: string;
    original_title?: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date?: string;
    first_air_date?: string;
    vote_average: number;
    adult: boolean;
    genre_ids: number[];
    media_type?: 'movie' | 'tv' | 'person'
    original_language: string;
    popularity: number;
    softscore: boolean;
    video: boolean;
    vote_count: number;
}

export interface PeliDetalle extends Peli {
    runtime: number
    genres: { id: number, name: string }[]
    videos: {
        results: {
            key: string,
            site: string,
            type: string
        }[];
    };
    credits: {
        cast: {
            id: number
            name: string
            profile_path: string | null
            character: string
        }[]
    }
}

export interface TMDBResponse {
    page: number
    results: Peli[]
    total_pages: number
    total_results: number
}


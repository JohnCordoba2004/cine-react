
export interface Peli {
    adult: boolean;
    backdrop_path: string | null;
    genre_ids: Array<number>;
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: number | null;
    release_date: string;
    softscore: boolean;
    title: string;
    video: boolean;
    vote_average: number;
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
}


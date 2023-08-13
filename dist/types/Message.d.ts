export interface Message {
    year: string;
    month: string;
    day: string;
    am: string;
    pm: string;
    today: string;
    ok: string;
    months: {
        full: string[];
        abbr: string[];
    }
    weeks: {
        full: string[];
        abbr: string[];
    }
}


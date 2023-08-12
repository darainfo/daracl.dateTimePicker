
export const EXPRESSIONS_FORMAT = [
    'YY', 'YYYY', 'MMMM', 'MMM', 'MM', 'M', 'dddd', 'ddd', 'dd', 'd', 'DD', 'D', 'S', 'HH', 'H', 'hh', 'h', 'mm', 'm', 'ss', 's', 'SSS', 'zzzz', 'zzz', 'zz', 'z', 'a', 'A'
];

export let MAX_CHAR_LENGTH = 0;

export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';

export enum DateViewMode {
    year = 'year'
    , month = 'month'
    , date = 'date'
    , datetime = 'datetime'
    , time = 'time'
}

EXPRESSIONS_FORMAT.forEach(item => {
    MAX_CHAR_LENGTH = Math.max(item.length, MAX_CHAR_LENGTH);
})

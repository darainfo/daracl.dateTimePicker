export default class DaraDate {
    private date;
    constructor(dt: Date);
    setYear(num: number): this;
    addYear(num: number): this;
    addMonth(num: number): this;
    setMonth(num: number): this;
    setDate(num: number): this;
    addDate(num: number): this;
    addWeek(num: number): this;
    addHours(num: number): this;
    setHour(num: number): this;
    addMinutes(num: number): this;
    setMinutes(num: number): this;
    addSeconds(num: number): this;
    addMilliseconds(num: number): this;
    compare(date: Date): 0 | 1 | -1;
    getYear(): number;
    getMonth(): number;
    getDate(): number;
    getDay(): number;
    getTime(): number;
    format(format: string): string;
    clone(): DaraDate;
}

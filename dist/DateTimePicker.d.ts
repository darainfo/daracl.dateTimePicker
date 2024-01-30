import { DateTimePickerOptions } from "@t/DateTimePickerOptions";
import { Message } from "@t/Message";
import { DateViewMode } from "./constants";
/**
 * date timepicker
 *
 * @class DateTimePicker
 * @typedef {DateTimePicker}
 */
export default class DateTimePicker {
    static format: (date: Date, format: string) => string;
    static parser: (dateStr: string, format: string) => Date | null;
    private readonly options;
    private datetimeElement;
    private targetElement;
    private currentDate;
    private dateFormat;
    private todayDate;
    private isInput;
    private isVisible;
    private _viewMode;
    private initMode;
    private hourInputEle;
    private minuteInputEle;
    private minDate;
    private maxDate;
    private minYear;
    private maxYear;
    private minMonth;
    private maxMonth;
    constructor(selector: string | HTMLElement, options: DateTimePickerOptions, message: Message);
    /**
     * default date format setting
     * @example
     ```
    setDefaultFormat({
      year: "YYYY",
      month: "YYYY-MM",
      date: "YYYY-MM-DD",
      time: "HH:mm",
      datetime: "YYYY-MM-DD HH:mm",
    });
     ```
     * @public
     * @static
     * @param {*} dateFormat
     */
    static setDefaultFormat(dateFormat: any): void;
    private _minDate;
    private _maxDate;
    set viewMode(mode: DateViewMode);
    get viewMode(): DateViewMode;
    /**
     * 모드  change
     * @param mode
     */
    changeViewMode(mode: DateViewMode): void;
    /**
     * init header event
     *
     * @public
     */
    private initHeaderEvent;
    /**
     * 날짜 달력 이벤트처리.
     */
    private initDateEvent;
    private isTimeMode;
    /**
     * 시간 분 설정 이벤트 처리.
     *
     * @public
     */
    initTimeEvent(): void;
    /**
     * 날짜 이동
     * @param moveMode // 앞뒤 이동 prev, next
     * @returns
     */
    moveDate(moveMode: string, e: Event): void;
    /**
     * get date value
     *
     * @returns
     */
    getDateValue(): string;
    /**
     * 옵션 셋팅
     * @static
     * @param {DateTimePickerOptions} options
     */
    static setOptions(options: DateTimePickerOptions): void;
    /**
     * 달력 보이기 처리.
     *
     * @returns
     */
    private show;
    /**
     * 달력 숨기기
     */
    private hide;
    /**
     * 바탕 클릭시 캘린더 숨김 처리.
     *
     * @param e
     */
    private _documentClickEvent;
    /**
     * 타켓 이벤트 처리.
     */
    private initTargetEvent;
    private dateMoveEvent;
    private dateChangeEvent;
    /**
     *  datepicker template  그리기
     */
    private createDatetimeTemplate;
    refresh(): void;
    /**
     * 년 달력 그리기
     */
    private yearDraw;
    /**
     * 월 달력 그리기
     */
    private monthDraw;
    /**
     * 날짜 그리기
     */
    private dayDraw;
    private isDayDisabled;
    private isYearDisabled;
    private isMonthDisabled;
    static setMessage(message: Message): void;
}

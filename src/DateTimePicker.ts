import { DateTimePickerOptions } from "@t/DateTimePickerOptions";
import { Message } from "@t/Message";
import format from "./format";
import parser from "./util/parser";
import Lanauage from "./Lanauage";
import utils from "./util/utils";
import DaraDate from "./DaraDate";
import { DEFAULT_FORMAT, DateViewMode } from "./constants";

let DEFAULT_OPTIONS: DateTimePickerOptions = {
  isEmbed: false, // layer or innerhtml
  initialDate: "",
  autoClose: true,
  mode: DateViewMode.date,
  enableTodayBtn: true,
  headerOrder: "month,year",
  format: "",
  zIndex: 1000,
  minDate: "",
  maxDate: "",
};

function hiddenElement() {
  if (document.getElementById("hiddenDaraDatetimeElement") == null) {
    document.querySelector("body")?.insertAdjacentHTML("beforeend", `<div id="hiddenDaraDatetimeElement" class="dara-datetime-hidden"></div>`);
  }

  return document.getElementById("hiddenDaraDatetimeElement");
}

let daraDatetimeIdx = 0;

/**
 * date timepicker
 *
 * @class DateTimePicker
 * @typedef {DateTimePicker}
 */
export default class DateTimePicker {
  public static format = format;
  public static parser = parser;

  private readonly options;

  private datetimeElement;

  private targetElement: HTMLElement;

  private currentDate: DaraDate;

  private dateFormat: string;

  private todayDate: string;

  private isInput: boolean = false;

  private isVisible = false;

  private _viewMode: DateViewMode;

  private initMode: DateViewMode;

  private hourInputEle: HTMLInputElement;

  private minuteInputEle: HTMLInputElement;

  private minDate: number;
  private maxDate: number;
  private minYear: number = -1;
  private maxYear: number = -1;
  private minMonth: number = -1;
  private maxMonth: number = -1;

  constructor(selector: string | HTMLElement, options: DateTimePickerOptions, message: Message) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);

    daraDatetimeIdx += 1;

    let selectorElement: HTMLElement;
    if (typeof selector === "string") {
      selectorElement = document.querySelector(selector) as HTMLElement;
    } else {
      selectorElement = selector;
    }

    if (!selectorElement) {
      throw new Error(`${selector} datetimepicker element not found`);
    }

    this._viewMode = Object.keys(DateViewMode).includes(this.options.mode) ? this.options.mode : DateViewMode.date;

    this.initMode = this._viewMode;

    Lanauage.set(message);

    if (this.initMode == DateViewMode.year) {
      this.dateFormat = this.options.format || DEFAULT_FORMAT.year;
    } else if (this.initMode == DateViewMode.month) {
      this.dateFormat = this.options.format || DEFAULT_FORMAT.month;
    } else if (this.initMode == DateViewMode.time) {
      this.dateFormat = this.options.format || DEFAULT_FORMAT.time;
    } else if (this.initMode == DateViewMode.datetime) {
      this.dateFormat = this.options.format || DEFAULT_FORMAT.datetime;
    } else {
      this.dateFormat = this.options.format || DEFAULT_FORMAT.date;
    }

    let viewDate: DaraDate;
    if (this.options.initialDate) {
      if (typeof this.options.initialDate === "string") {
        viewDate = new DaraDate(parser(this.options.initialDate, this.dateFormat) || new Date());
      } else {
        viewDate = new DaraDate(this.options.initialDate);
      }
    } else {
      viewDate = new DaraDate(new Date());
      this.options.initialDate = viewDate.format(this.dateFormat);
    }

    this.todayDate = viewDate.format(DEFAULT_FORMAT.date);
    this.currentDate = viewDate;
    this.targetElement = selectorElement;

    this.minDate = this._minDate();
    this.maxDate = this._maxDate();

    if (this.options.isEmbed) {
      this.datetimeElement = selectorElement;
      this.datetimeElement.className = `dara-datetime-wrapper ddtp-${daraDatetimeIdx} embed`;
    } else {
      this.isInput = true;
      this.targetElement.setAttribute("value", viewDate.format(this.dateFormat));

      const datetimeElement = document.createElement("div");
      datetimeElement.className = `dara-datetime-wrapper ddtp-${daraDatetimeIdx} layer`;
      datetimeElement.setAttribute("style", `z-index:${this.options.zIndex};`);
      hiddenElement()?.appendChild(datetimeElement);

      this.datetimeElement = datetimeElement;

      this.initTargetEvent();
    }

    this.createDatetimeTemplate();

    if (this.isTimeMode()) {
      this.hourInputEle = this.datetimeElement.querySelector(".ddtp-hour") as HTMLInputElement;
      this.minuteInputEle = this.datetimeElement.querySelector(".ddtp-minute") as HTMLInputElement;
    } else {
      this.hourInputEle = {} as HTMLInputElement;
      this.minuteInputEle = {} as HTMLInputElement;
    }

    this.changeViewMode(this._viewMode);

    this.initHeaderEvent();

    this.initDateEvent();

    this.initTimeEvent();
  }

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
  public static setDefaultFormat(dateFormat: any) {
    Object.assign(DEFAULT_FORMAT, dateFormat);
  }

  private _minDate() {
    let minDate = this.options.minDate;

    if (minDate != "") {
      if (typeof minDate === "string") {
        const dt = parser(minDate, this.dateFormat);
        if (!dt) {
          return -1;
        }

        minDate = dt;
      }
      this.minYear = minDate.getFullYear();
      this.minMonth = +(this.minYear + utils.pad(minDate.getMonth(), 2));
      return new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate(), 0, 0).getTime();
    }
    return -1;
  }

  private _maxDate() {
    let maxDate = this.options.maxDate;

    if (maxDate != "") {
      if (typeof maxDate === "string") {
        const dt = parser(maxDate, this.dateFormat);
        if (!dt) {
          return -1;
        }

        maxDate = dt;
      }
      this.maxYear = maxDate.getFullYear();
      this.maxMonth = +(this.maxYear + utils.pad(maxDate.getMonth(), 2));
      return new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 23, 59).getTime();
    }
    return -1;
  }

  public set viewMode(mode: DateViewMode) {
    if (this._viewMode === mode) {
      return;
    }

    this._viewMode = mode;

    this.changeViewMode(mode);
  }

  public get viewMode(): DateViewMode {
    return this._viewMode;
  }

  /**
   * 모드  change
   * @param mode
   */
  public changeViewMode(mode: DateViewMode) {
    this.datetimeElement.querySelector(".ddtp-datetime")?.setAttribute("view-mode", mode);

    if (mode === "year") {
      this.yearDraw();
    } else if (mode === "month") {
      this.monthDraw();
    } else {
      this.dayDraw();
    }
  }

  /**
   * init header event
   *
   * @public
   */
  private initHeaderEvent() {
    this.datetimeElement.querySelector(".ddtp-move-btn.prev")?.addEventListener("click", (e: Event) => {
      this.moveDate("prev");
    });

    this.datetimeElement.querySelector(".ddtp-move-btn.next")?.addEventListener("click", (e: Event) => {
      this.moveDate("next");
    });

    this.datetimeElement.querySelector(".ddtp-header-year")?.addEventListener("click", (e: Event) => {
      this.viewMode = DateViewMode.year;
    });

    this.datetimeElement.querySelector(".ddtp-header-month")?.addEventListener("click", (e: Event) => {
      this.viewMode = DateViewMode.month;
    });
  }

  /**
   * 날짜 달력 이벤트처리.
   */
  private initDateEvent() {
    this.datetimeElement.querySelector(".ddtp-day-body")?.addEventListener("click", (e: Event) => {
      const targetEle = e.target as Element;

      if (targetEle.classList.contains("ddtp-day") || targetEle.closest(".ddtp-day")) {
        const selectDate = targetEle.getAttribute("data-day") || "1";

        const mmDD = selectDate.split(",");

        this.currentDate.setMonth(+mmDD[0] - 1);
        this.currentDate.setDate(+mmDD[1]);

        if (this.isDayDisabled(this.currentDate)) {
          return;
        }

        this.datetimeElement.querySelector(".select")?.classList.remove("select");

        targetEle.classList.add("select");

        if (this.isTimeMode()) {
          this.currentDate.setHour(+this.hourInputEle.value);
          this.currentDate.setMinutes(+this.minuteInputEle.value);
        }

        this.dateChangeEvent(e);
      }
    });

    // today click
    this.datetimeElement.querySelector(".time-today")?.addEventListener("click", (e: Event) => {
      const initDate = new DaraDate(parser(this.todayDate, DEFAULT_FORMAT.date) || new Date());
      this.currentDate.setYear(initDate.getYear());
      this.currentDate.setMonth(initDate.getMonth() - 1);
      this.currentDate.setDate(initDate.getDate());
      this.changeViewMode(this.initMode);
    });
  }

  private isTimeMode(): boolean {
    return this._viewMode === DateViewMode.time || this._viewMode === DateViewMode.datetime;
  }

  /**
   * 시간 분 설정 이벤트 처리.
   *
   * @public
   */
  public initTimeEvent() {
    if (!this.isTimeMode()) return;

    let hh = this.currentDate.format("HH");

    const hourInputEle = this.datetimeElement.querySelector(".ddtp-hour") as HTMLInputElement;
    const hourRangeEle = this.datetimeElement.querySelector(".ddtp-hour-range") as HTMLInputElement;
    hourInputEle.value = hh;
    hourRangeEle.value = hh;

    hourInputEle.addEventListener("input", (e: Event) => {
      const targetElement = e.target as HTMLInputElement;
      const addVal = utils.pad(targetElement.value, 2);
      hourInputEle.value = addVal;
      hourRangeEle.value = addVal;
    });

    hourRangeEle.addEventListener("input", (e: Event) => {
      const targetElement = e.target as HTMLInputElement;
      hourInputEle.value = utils.pad(targetElement.value, 2);
    });

    let mm = this.currentDate.format("mm");
    const minuteInputEle = this.datetimeElement.querySelector(".ddtp-minute") as HTMLInputElement;
    const minuteRangeEle = this.datetimeElement.querySelector(".ddtp-minute-range") as HTMLInputElement;

    minuteInputEle.value = mm;
    minuteRangeEle.value = mm;

    minuteInputEle.addEventListener("input", (e: Event) => {
      const targetElement = e.target as HTMLInputElement;
      const addVal = utils.pad(targetElement.value, 2);
      minuteInputEle.value = addVal;
      minuteRangeEle.value = addVal;
    });

    minuteRangeEle.addEventListener("input", (e: Event) => {
      const targetElement = e.target as HTMLInputElement;
      minuteInputEle.value = utils.pad(targetElement.value, 2);
    });

    this.datetimeElement.querySelector(".time-select")?.addEventListener("click", (e: Event) => {
      this.currentDate.setHour(+hourInputEle.value);
      this.currentDate.setMinutes(+minuteInputEle.value);
      this.dateChangeEvent(e);
    });
  }

  /**
   * 날짜 이동
   * @param moveMode // 앞뒤 이동 prev, next
   * @returns
   */
  public moveDate(moveMode: string) {
    if (this._viewMode === DateViewMode.date || this._viewMode === DateViewMode.datetime) {
      this.currentDate.addMonth("prev" === moveMode ? -1 : 1);
      this.dayDraw();
      return;
    }

    if (this._viewMode === DateViewMode.month) {
      this.currentDate.addYear("prev" === moveMode ? -1 : 1);
      this.monthDraw();
      return;
    }

    if (this._viewMode === DateViewMode.year) {
      this.currentDate.addYear("prev" === moveMode ? -16 : 16);
      this.yearDraw();
    }
  }

  /**
   * get date value
   *
   * @returns
   */
  public getDateValue() {
    return this.currentDate.format(this.dateFormat);
  }

  /**
   * 옵션 셋팅
   * @static
   * @param {DateTimePickerOptions} options
   */
  static setOptions(options: DateTimePickerOptions) {
    DEFAULT_OPTIONS = Object.assign({}, DEFAULT_OPTIONS, options);
  }

  /**
   * 달력 보이기 처리.
   *
   * @returns
   */
  private show() {
    if (this.isVisible) {
      return;
    }
    this.isVisible = true;

    const docSize = getDocSize();
    this.datetimeElement.classList.remove("hide");

    this.datetimeElement.classList.add("show");

    const rect = this.targetElement.getBoundingClientRect();

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    const offsetTop = rect.top + scrollTop;
    let top = offsetTop + this.targetElement.offsetHeight + 2;
    const left = rect.left + scrollLeft;

    if (top + this.datetimeElement.offsetHeight > docSize.clientHeight) {
      const newTop = offsetTop - (this.datetimeElement.offsetHeight + 2);
      top = newTop > 0 ? newTop : top;
    }

    this.datetimeElement.setAttribute("style", `top:${top}px;left:${left}px;z-index:${this.options.zIndex}`);

    document.addEventListener("click", this._documentClickEvent);
  }

  /**
   * 달력 숨기기
   */
  private hide() {
    this.isVisible = false;

    this.datetimeElement.classList.remove("show");

    this.datetimeElement.classList.add("hide");

    document.removeEventListener("click", this._documentClickEvent);
  }

  /**
   * 바탕 클릭시 캘린더 숨김 처리.
   *
   * @param e
   */
  private _documentClickEvent = (e: MouseEvent) => {
    if (this.isVisible && e.target != this.targetElement && !e.composedPath().includes(this.datetimeElement)) {
      this.hide();
    }
  };

  /**
   * 타켓 이벤트 처리.
   */
  private initTargetEvent() {
    if (this.targetElement) {
      this.targetElement.addEventListener("click", (e: Event) => {
        this.show();
      });
    }
  }

  private dateChangeEvent(e: Event) {
    const formatValue = this.currentDate.format(this.dateFormat);

    if (this.options.onChange) {
      if (this.options.onChange(formatValue, e) === false) {
        return;
      }
    }

    if (this.isInput) {
      this.targetElement.setAttribute("value", formatValue);
    }

    if (!this.options.isEmbed && this.options.autoClose) {
      this.hide();
    }
  }

  /**
   *  datepicker template  그리기
   */
  private createDatetimeTemplate() {
    const headerOrder = this.options.headerOrder.split(",");

    let datetimeTemplate = `<div class="ddtp-datetime" view-mode="${this._viewMode}">
			<div class="ddtp-header">
                <span class="${headerOrder[0] === "year" ? "ddtp-header-year" : "ddtp-header-month"}"></span>
                <span class="${headerOrder[0] === "year" ? "ddtp-header-month" : "ddtp-header-year"}"></span>

                <span class="ddtp-date-move">  
                    <a href="javascript:;" class="ddtp-move-btn prev">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                    </a>
                    <a href="javascript:;" class="ddtp-move-btn next">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                    </a> 
                </span>
			</div>
            <div class="ddtp-body">
                <table class="ddtp-days">
                    <thead class="ddtp-day-header">
                        <tr>		
                            <td class="ddtp-day-label sun red">${Lanauage.getWeeksMessage(0)}</td>		
                            <td class="ddtp-day-label">${Lanauage.getWeeksMessage(1)}</td>		
                            <td class="ddtp-day-label">${Lanauage.getWeeksMessage(2)}</td>		
                            <td class="ddtp-day-label">${Lanauage.getWeeksMessage(3)}</td>		
                            <td class="ddtp-day-label">${Lanauage.getWeeksMessage(4)}</td>		
                            <td class="ddtp-day-label">${Lanauage.getWeeksMessage(5)}</td>		
                            <td class="ddtp-day-label sat">${Lanauage.getWeeksMessage(6)}</td>		
                        </tr>
                    </thead>
                    <tbody class="ddtp-day-body">
                    </tbody>
                    
                    <tfoot class="ddtp-day-footer">
                        <td colspan="7">
                            <div style="text-align:center;margin-top: 5px;${this.options.enableTodayBtn ? "" : "display:none;"}"><button type="button" class="time-today">${Lanauage.getMessage("today")}</button></div>
                            <div class="footer-tooltip"></div>
                        </td>
                    </tfoot>
                </table>

                <div class="ddtp-times">
                        <div class="time-container">
                            <div class="ddtp-time">
                                <span>H: </span><input type="number" class="ddtp-hour" min="0" max="23">
                                <input type="range" min="0" max="23" class="ddtp-hour-range">
                            </div>
                            <div class="ddtp-time">
                                <span>M: </span><input type="number" class="ddtp-minute" min="0" max="59">
                                <input type="range" min="0" max="59" class="ddtp-minute-range">
                            </div>
                        </div>
                        <div class="time-btn">
                            <button type="button" class="time-select">${Lanauage.getMessage("ok")}</button>
                        </div>
                </div>

                <div class="ddtp-months">
                </div>

                <div class="ddtp-years">
                </div>
            </div>
        </div>`;

    this.datetimeElement.innerHTML = datetimeTemplate;
  }

  /**
   * 년 달력 그리기
   */
  public yearDraw() {
    const currentYear = this.currentDate.format("YYYY");

    const startYear = +currentYear - 8;

    (this.datetimeElement.querySelector(".ddtp-header-year") as Element).textContent = `${startYear} ~ ${startYear + 15}`;

    const calHTML: string[] = [];
    for (let i = 0; i < 16; i++) {
      const year = startYear + i;

      const disabled = this.isYearDisabled(year);

      calHTML.push(`<div class="ddtp-year ${disabled ? "disabled" : ""}" data-year="${year}">${year}</div>`);
    }
    (this.datetimeElement.querySelector(".ddtp-years") as Element).innerHTML = calHTML.join("");

    this.datetimeElement.querySelectorAll(".ddtp-year")?.forEach((yearEle) => {
      yearEle.addEventListener("click", (e: Event) => {
        const targetEle = e.target as Element;

        if (targetEle) {
          const year = targetEle.getAttribute("data-year");

          if (year) {
            const numYear = +year;

            if (this.isYearDisabled(numYear)) {
              return;
            }

            if (this.initMode == DateViewMode.year) {
              if (this.isYearDisabled(numYear)) {
                return;
              }
              this.currentDate.setYear(numYear);
              this.dateChangeEvent(e);
              return;
            }

            this.currentDate.setYear(numYear);
            this.viewMode = DateViewMode.month;
          }
        }
      });
    });
  }

  /**
   * 월 달력 그리기
   */
  public monthDraw() {
    const year = this.currentDate.format("YYYY");
    (this.datetimeElement.querySelector(".ddtp-header-year") as Element).textContent = year;

    const monthElements = this.datetimeElement.querySelectorAll(".ddtp-months > .ddtp-month");

    if (monthElements.length > 0) {
      if (this.isYearDisabled(+year)) {
        monthElements.forEach((monthEle) => {
          if (!monthEle.classList.contains("disabled")) {
            monthEle.classList.add("disabled");
          }
        });
        return;
      }

      monthElements.forEach((monthEle, idx) => {
        if (this.isMonthDisabled(+year, idx)) {
          if (!monthEle.classList.contains("disabled")) {
            monthEle.classList.add("disabled");
          }
        } else {
          monthEle.classList.remove("disabled");
        }
      });

      return;
    }

    (this.datetimeElement.querySelector(".ddtp-header-month") as Element).textContent = this.currentDate.format("MMMM");

    const calHTML: string[] = [];
    for (let i = 0; i < 12; i++) {
      const disabled = this.isMonthDisabled(+year, i);
      calHTML.push(`<div class="ddtp-month ${disabled ? "disabled" : ""}" data-month="${i}">${Lanauage.getMonthsMessage(i, "abbr")}</div>`);
    }
    (this.datetimeElement.querySelector(".ddtp-months") as Element).innerHTML = calHTML.join("");

    this.datetimeElement.querySelectorAll(".ddtp-month")?.forEach((monthEle) => {
      monthEle.addEventListener("click", (e: Event) => {
        const targetEle = e.target as Element;

        if (targetEle) {
          const month = targetEle.getAttribute("data-month");

          if (month) {
            if (this.isMonthDisabled(this.currentDate.getYear(), +month)) {
              return false;
            }

            if (this.initMode == DateViewMode.month) {
              this.currentDate.setMonth(+month);
              this.dateChangeEvent(e);
              return;
            }
            this.currentDate.setMonth(+month);
            this.viewMode = this.initMode;
            this.dayDraw();
          }
        }
      });
    });
  }

  /**
   * 날짜 그리기
   */
  public dayDraw() {
    let monthFirstDate = this.currentDate.clone();
    monthFirstDate.setDate(1);

    (this.datetimeElement.querySelector(".ddtp-header-year") as Element).textContent = monthFirstDate.format("YYYY");
    (this.datetimeElement.querySelector(".ddtp-header-month") as Element).textContent = monthFirstDate.format("MMMM");

    let day = monthFirstDate.getDay();

    if (day != 0) {
      monthFirstDate.addDate(-day);
    }

    const calHTML = [];
    for (let i = 0; i < 42; i++) {
      let dateItem;
      if (i == 0) {
        dateItem = monthFirstDate;
      } else {
        dateItem = monthFirstDate.clone().addDate(i);
      }

      const tooltipDt = dateItem.format(DEFAULT_FORMAT.date);

      if (i % 7 == 0) {
        calHTML.push((i == 0 ? "" : "</tr>") + "<tr>");
      }

      let disabled = this.isDayDisabled(dateItem);

      calHTML.push(`<td class="ddtp-day ${i % 7 == 0 ? "red" : ""} ${this.todayDate == tooltipDt ? "today" : ""} ${disabled ? "disabled" : ""}" data-day="${dateItem.format("M,D")}">`);
      calHTML.push(`<span>${dateItem.format("d")}</span>`);
      calHTML.push("</td>");
    }

    calHTML.push("</tr>");

    (this.datetimeElement.querySelector(".ddtp-day-body") as Element).innerHTML = calHTML.join("");
  }

  private isDayDisabled(dateItem: DaraDate) {
    if ((this.minDate != -1 && this.minDate > dateItem.getTime()) || (this.maxDate != -1 && this.maxDate < dateItem.getTime())) {
      return true;
    }

    return false;
  }

  private isYearDisabled(year: number) {
    if ((this.minYear != -1 && this.minYear > year) || (this.maxYear != -1 && this.maxYear < year)) {
      return true;
    }

    return false;
  }

  private isMonthDisabled(year: number, month: number) {
    if (this.isYearDisabled(year)) {
      return true;
    }

    let yearMonth = +(year + utils.pad(month, 2));

    if ((this.minMonth != -1 && this.minMonth > yearMonth) || (this.maxMonth != -1 && this.maxMonth < yearMonth)) {
      return true;
    }

    return false;
  }

  public static setMessage(message: Message) {
    Lanauage.setDefaultMessage(message);
  }
}

function getDocSize() {
  return {
    clientHeight: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    clientWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
  };
}

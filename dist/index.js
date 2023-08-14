// src/Lanauage.ts
var localeMessage = {
  year: "Year",
  month: "Month",
  day: "Day",
  am: "AM",
  pm: "PM",
  today: "Today",
  ok: "Ok",
  months: {
    full: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    abbr: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  },
  weeks: {
    full: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    abbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  }
};
var Language = class {
  constructor() {
    this.lang = localeMessage;
  }
  setDefaultMessage(lang) {
    localeMessage = Object.assign(localeMessage, lang);
  }
  /**
   * 다국어 메시지 등록
   *
   * @public
   * @param {?Message} [lang] 둥록할 메시지
   */
  set(lang) {
    this.lang = Object.assign({}, localeMessage, lang);
  }
  /**
   * 메시지 얻기
   *
   * @public
   * @param {string} messageKey 메시지 키
   * @returns {*}
   */
  getMessage(messageKey) {
    return this.lang[messageKey];
  }
  getMonthsMessage(idx, mode = "abbr") {
    return this.lang.months[mode][idx] || "";
  }
  getWeeksMessage(idx, mode = "abbr") {
    return this.lang.weeks[mode][idx] || "";
  }
  getMonthsIdx(val, mode = "abbr") {
    return mode == "full" ? this.lang.months.full.indexOf(val) : this.lang.months.abbr.indexOf(val);
  }
  getWeeksIdx(val, mode = "abbr") {
    return mode == "full" ? this.lang.weeks.full.indexOf(val) : this.lang.weeks.abbr.indexOf(val);
  }
};
var Lanauage_default = new Language();

// src/constants.ts
var EXPRESSIONS_FORMAT = [
  "YY",
  "YYYY",
  "MMMM",
  "MMM",
  "MM",
  "M",
  "dddd",
  "ddd",
  "dd",
  "d",
  "DD",
  "D",
  "S",
  "HH",
  "H",
  "hh",
  "h",
  "mm",
  "m",
  "ss",
  "s",
  "SSS",
  "zzzz",
  "zzz",
  "zz",
  "z",
  "a",
  "A"
];
var MAX_CHAR_LENGTH = 0;
var DEFAULT_DATE_FORMAT = "YYYY-MM-DD";
var DateViewMode = /* @__PURE__ */ ((DateViewMode2) => {
  DateViewMode2["year"] = "year";
  DateViewMode2["month"] = "month";
  DateViewMode2["date"] = "date";
  DateViewMode2["datetime"] = "datetime";
  DateViewMode2["time"] = "time";
  return DateViewMode2;
})(DateViewMode || {});
EXPRESSIONS_FORMAT.forEach((item) => {
  MAX_CHAR_LENGTH = Math.max(item.length, MAX_CHAR_LENGTH);
});

// src/util/utils.ts
var xssFilter = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
var utils_default = {
  replace(str) {
    let returnText = str;
    if (returnText) {
      Object.keys(xssFilter).forEach((key) => {
        returnText = returnText.replaceAll(key, xssFilter[key]);
      });
    }
    return returnText;
  },
  unReplace(inputText) {
    let returnText = inputText;
    if (returnText) {
      Object.keys(xssFilter).forEach((key) => {
        returnText = returnText.replaceAll(xssFilter[key], key);
      });
    }
    return returnText;
  },
  unFieldName(fieldName) {
    if (fieldName) {
      return this.unReplace(fieldName).replaceAll('"', '\\"');
    }
    return "";
  },
  isBlank(value) {
    if (value === null)
      return true;
    if (value === "")
      return true;
    if (typeof value === "undefined")
      return true;
    if (typeof value === "string" && (value === "" || value.replace(/\s/g, "") === ""))
      return true;
    return false;
  },
  isUndefined(value) {
    return typeof value === "undefined";
  },
  isFunction(value) {
    return typeof value === "function";
  },
  isString(value) {
    return typeof value === "string";
  },
  isNumber(value) {
    if (this.isBlank(value)) {
      return false;
    }
    return !isNaN(value);
  },
  isArray(value) {
    return Array.isArray(value);
  },
  getHashCode(str) {
    let hash = 0;
    if (str.length == 0)
      return hash;
    for (let i = 0; i < str.length; i++) {
      let tmpChar = str.charCodeAt(i);
      hash = (hash << 5) - hash + tmpChar;
      hash = hash & hash;
    }
    return hash;
  },
  pad(str, length) {
    str = String(str);
    while (str.length < length) {
      str = "0" + str;
    }
    return str;
  }
};

// src/format/index.ts
var format_default = (date, format) => {
  format = format || "YYYY-MM-DD";
  const len = format.length;
  let result = [];
  for (let i = 0; i < len; ) {
    let minLen = Math.min(MAX_CHAR_LENGTH, len - i);
    let j = minLen;
    for (; j > 0; j--) {
      const v = format.substring(i, i + j);
      if (EXPRESSIONS_FORMAT.includes(v)) {
        try {
          result.push(expressionsFunction[v](date));
        } catch (e) {
          console.log(EXPRESSIONS_FORMAT.includes(v), v, e);
        }
        break;
      }
    }
    if (j < 1) {
      result.push(format.substring(i, i + 1));
      i += 1;
    } else {
      i += j;
    }
  }
  return result.join("");
};
var expressionsFunction = {
  YY: (date) => {
    return String(date.getFullYear()).slice(-2);
  },
  YYYY: (date) => {
    return String(date.getFullYear());
  },
  M: (date) => {
    return String(date.getMonth() + 1);
  },
  MM: (date) => {
    return utils_default.pad(date.getMonth() + 1, 2);
  },
  MMM: (date) => {
    return Lanauage_default.getMonthsMessage(date.getMonth());
  },
  MMMM: (date) => {
    return Lanauage_default.getMonthsMessage(date.getMonth(), "full");
  },
  D: (date) => {
    return String(date.getDate());
  },
  DD: (date) => {
    return utils_default.pad(date.getDate(), 2);
  },
  d: (date) => {
    return String(date.getDate());
  },
  dd: (date) => {
    return utils_default.pad(date.getDate(), 2);
  },
  ddd: (date) => {
    return Lanauage_default.getWeeksMessage(date.getDay());
  },
  dddd: (date) => {
    return Lanauage_default.getWeeksMessage(date.getDay(), "full");
  },
  H: (date) => {
    return String(date.getHours());
  },
  HH: (date) => {
    return utils_default.pad(date.getHours(), 2);
  },
  h: (date) => {
    return getH(date);
  },
  hh: (date) => {
    return utils_default.pad(getH(date), 2);
  },
  a: (date) => {
    return String(date.getFullYear()).slice(-2);
  },
  A: (date) => {
    return getMeridiem(date, true, true);
  },
  m: (date) => {
    return String(date.getMinutes());
  },
  mm: (date) => {
    return utils_default.pad(date.getMinutes(), 2);
  },
  s: (date) => {
    return String(date.getSeconds());
  },
  ss: (date) => {
    return utils_default.pad(date.getSeconds(), 2);
  },
  SSS: (date) => {
    return utils_default.pad(date.getMilliseconds(), 3);
  }
};
function getH(date) {
  let hour = date.getHours();
  if (hour > 12) {
    hour -= 12;
  } else if (hour < 1) {
    hour = 12;
  }
  return hour;
}
function getMeridiem(date, isUpper, isShort) {
  const hour = date.getHours();
  let m = hour < 12 ? "am" : "pm";
  m = Lanauage_default.getMessage(m);
  m = isUpper ? m.toUpperCase() : m;
  return m;
}

// src/util/parser.ts
var parser_default = (dateStr, format) => {
  if (dateStr.length > 1e3) {
    return null;
  }
  format = format || DEFAULT_DATE_FORMAT;
  const dateInfo = {
    year: (/* @__PURE__ */ new Date()).getFullYear(),
    month: 0,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
    isPm: false,
    isH: false,
    charIdx: 0
  };
  const len = format.length;
  let startIdx = 0;
  for (let i = 0; i < len; ) {
    let minLen = Math.min(MAX_CHAR_LENGTH, len - i);
    let j = minLen;
    for (; j > 0; j--) {
      const v = format.substring(i, i + j);
      if (EXPRESSIONS_FORMAT.includes(v)) {
        const expInfo = expressionsFunction2[v];
        const val = matchFind(dateStr.substring(startIdx), expInfo[0]);
        expInfo[1](dateInfo, val);
        startIdx += val.length;
        break;
      }
    }
    if (j < 1) {
      i += 1;
      startIdx += 1;
    } else {
      i += j;
    }
  }
  if (dateInfo.hour != null && !dateInfo.isH) {
    if (dateInfo.isPm && +dateInfo.hour !== 12) {
      dateInfo.hour = +dateInfo.hour + 12;
    } else if (!dateInfo.isPm && +dateInfo.hour === 12) {
      dateInfo.hour = 0;
    }
  }
  let date;
  date = new Date(
    dateInfo.year,
    dateInfo.month,
    dateInfo.day,
    dateInfo.hour,
    dateInfo.minute,
    dateInfo.second,
    dateInfo.millisecond
  );
  return date;
};
var matchFind = (val, regexp) => {
  const match = regexp.exec(val);
  return match == null ? "" : match[0];
};
var digitsCheck = {
  twoOptional: /\d\d?/,
  two: /\d\d/,
  three: /\d{3}/,
  four: /\d{4}/
};
var word = /[^\s]+/;
var expressionsFunction2 = {
  YY: [digitsCheck["two"], (dateInfo, val) => {
    dateInfo.year = +(("" + (/* @__PURE__ */ new Date()).getFullYear()).substring(0, 2) + val);
    return dateInfo;
  }],
  YYYY: [digitsCheck["four"], (dateInfo, val) => {
    dateInfo.year = +val;
    return dateInfo;
  }],
  M: [digitsCheck["twoOptional"], (dateInfo, val) => {
    dateInfo.month = +val - 1;
    return dateInfo;
  }],
  MM: [digitsCheck["two"], (dateInfo, val) => {
    dateInfo.month = +val - 1;
    return dateInfo;
  }],
  MMM: [word, (dateInfo, val) => {
    dateInfo.month = Lanauage_default.getMonthsIdx(val, "abbr");
    return dateInfo;
  }],
  MMMM: [word, (dateInfo, val) => {
    dateInfo.month = Lanauage_default.getMonthsIdx(val, "full");
    return dateInfo;
  }],
  D: [digitsCheck["twoOptional"], (dateInfo, val) => {
    dateInfo.day = +val;
    return dateInfo;
  }],
  DD: [digitsCheck["two"], (dateInfo, val) => {
    dateInfo.day = +val;
    return dateInfo;
  }],
  d: [digitsCheck["twoOptional"], (dateInfo, val) => {
    dateInfo.day = +val;
    return dateInfo;
  }],
  dd: [digitsCheck["two"], (dateInfo, val) => {
    dateInfo.day = +val;
    return dateInfo;
  }],
  ddd: [word, (dateInfo, val) => {
    return dateInfo;
  }],
  dddd: [word, (dateInfo, val) => {
    return dateInfo;
  }],
  H: [digitsCheck["twoOptional"], (dateInfo, val) => {
    dateInfo.hour = +val;
    dateInfo.isH = true;
    return dateInfo;
  }],
  HH: [digitsCheck["two"], (dateInfo, val) => {
    dateInfo.hour = +val;
    dateInfo.isH = true;
    return dateInfo;
  }],
  h: [digitsCheck["twoOptional"], (dateInfo, val) => {
    dateInfo.hour = +val;
    return dateInfo;
  }],
  hh: [digitsCheck["two"], (dateInfo, val) => {
    dateInfo.hour = +val;
    return dateInfo;
  }],
  a: [word, (dateInfo, val) => {
    if (Lanauage_default.getMessage("am") != val.toLowerCase()) {
      dateInfo.isPm = true;
    }
    return dateInfo;
  }],
  A: [word, (dateInfo, val) => {
    if (Lanauage_default.getMessage("am") != val.toLowerCase()) {
      dateInfo.isPm = true;
    }
    return dateInfo;
  }],
  m: [digitsCheck["twoOptional"], (dateInfo, val) => {
    dateInfo.minute = +val;
    return dateInfo;
  }],
  mm: [digitsCheck["two"], (dateInfo, val) => {
    dateInfo.minute = +val;
    return dateInfo;
  }],
  s: [digitsCheck["twoOptional"], (dateInfo, val) => {
    dateInfo.second = +val;
    return dateInfo;
  }],
  ss: [digitsCheck["two"], (dateInfo, val) => {
    dateInfo.second = +val;
    return dateInfo;
  }],
  SSS: [digitsCheck["three"], (dateInfo, val) => {
    dateInfo.millisecond = +val;
    return dateInfo;
  }]
};

// src/DaraDate.ts
var DaraDate = class _DaraDate {
  constructor(dt) {
    this.date = dt;
  }
  setYear(num) {
    this.date.setFullYear(num);
    return this;
  }
  addYear(num) {
    this.date.setFullYear(this.date.getFullYear() + num);
    return this;
  }
  addMonth(num) {
    this.date.setMonth(this.date.getMonth() + num);
    return this;
  }
  setMonth(num) {
    this.date.setMonth(num);
    return this;
  }
  setDate(num) {
    this.date.setDate(num);
    return this;
  }
  addDate(num) {
    this.date.setDate(this.date.getDate() + num);
    return this;
  }
  addWeek(num) {
    this.date.setDate(this.date.getDate() + num * 7);
    return this;
  }
  addHours(num) {
    this.date.setHours(this.date.getHours() + num);
    return this;
  }
  setHour(num) {
    this.date.setHours(num);
    return this;
  }
  addMinutes(num) {
    this.date.setMinutes(this.date.getMinutes() + num);
    return this;
  }
  setMinutes(num) {
    this.date.setMinutes(num);
    return this;
  }
  addSeconds(num) {
    this.date.setSeconds(this.date.getSeconds() + num);
    return this;
  }
  addMilliseconds(num) {
    this.date.setMilliseconds(this.date.getMilliseconds() + num);
    return this;
  }
  compare(date) {
    if (this.date.valueOf() < date.valueOf()) {
      return -1;
    } else if (this.date.valueOf() > date.valueOf()) {
      return 1;
    }
    return 0;
  }
  getYear() {
    return this.date.getFullYear();
  }
  getMonth() {
    return this.date.getMonth() + 1;
  }
  getDate() {
    return this.date.getDate();
  }
  getDay() {
    return this.date.getDay();
  }
  getTime() {
    return this.date.getTime();
  }
  format(format) {
    return format_default(this.date, format);
  }
  clone() {
    return new _DaraDate(new Date(this.date.valueOf()));
  }
};

// src/DateTimePicker.ts
var DEFAULT_OPTIONS = {
  isEmbed: false,
  initialDate: "",
  autoClose: true,
  mode: "date" /* date */,
  headerOrder: "month,year",
  format: "YYYY-MM-DD",
  zIndex: 1e3,
  minDate: "",
  maxDate: ""
};
function hiddenElement() {
  if (document.getElementById("hiddenDaraDatetimeElement") == null) {
    document.querySelector("body")?.insertAdjacentHTML("beforeend", `<div id="hiddenDaraDatetimeElement" class="dara-datetime-hidden"></div>`);
  }
  return document.getElementById("hiddenDaraDatetimeElement");
}
var daraDatetimeIdx = 0;
var DateTimePicker = class {
  constructor(selector, options, message) {
    this.isInput = false;
    this.isVisible = false;
    this.minYear = -1;
    this.maxYear = -1;
    this.minMonth = -1;
    this.maxMonth = -1;
    /**
     * 바탕 클릭시 캘린더 숨김 처리. 
     * 
     * @param e 
     */
    this._documentClickEvent = (e) => {
      if (this.isVisible && (e.target != this.targetElement && !e.composedPath().includes(this.datetimeElement))) {
        this.hide();
      }
    };
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    daraDatetimeIdx += 1;
    let selectorElement;
    if (typeof selector === "string") {
      selectorElement = document.querySelector(selector);
    } else {
      selectorElement = selector;
    }
    if (!selectorElement) {
      throw new Error(`${selector} datetimepicker element not found`);
    }
    this._viewMode = Object.keys(DateViewMode).includes(this.options.mode) ? this.options.mode : "date" /* date */;
    this.initMode = this._viewMode;
    Lanauage_default.set(message);
    this.dateFormat = this.options.format || DEFAULT_DATE_FORMAT;
    let viewDate;
    if (typeof this.options.initialDate) {
      if (typeof this.options.initialDate === "string") {
        viewDate = new DaraDate(parser_default(this.options.initialDate, this.dateFormat) || /* @__PURE__ */ new Date());
      } else {
        viewDate = new DaraDate(this.options.initialDate);
      }
    } else {
      viewDate = new DaraDate(/* @__PURE__ */ new Date());
    }
    this.initialDate = viewDate.format(this.dateFormat);
    this.currentDate = viewDate;
    this.targetElement = selectorElement;
    this.minDate = this._minDate();
    this.maxDate = this._maxDate();
    if (this.options.isEmbed) {
      this.datetimeElement = selectorElement;
      this.datetimeElement.className = `dara-datetime-wrapper ddtp-${daraDatetimeIdx} embed`;
    } else {
      this.isInput = true;
      this.targetElement.setAttribute("value", this.initialDate);
      const datetimeElement = document.createElement("div");
      datetimeElement.className = `dara-datetime-wrapper ddtp-${daraDatetimeIdx} layer`;
      datetimeElement.setAttribute("style", `z-index:${this.options.zIndex};`);
      hiddenElement()?.appendChild(datetimeElement);
      this.datetimeElement = datetimeElement;
      this.initTargetEvent();
    }
    this.createDatetimeTemplate();
    if (this.isTimeMode()) {
      this.hourInputEle = this.datetimeElement.querySelector(".ddtp-hour");
      this.minuteInputEle = this.datetimeElement.querySelector(".ddtp-minute");
    } else {
      this.hourInputEle = {};
      this.minuteInputEle = {};
    }
    this.changeViewMode(this._viewMode);
    this.initHeaderEvent();
    this.initDateEvent();
    this.initTimeEvent();
  }
  static {
    this.format = format_default;
  }
  static {
    this.parser = parser_default;
  }
  _minDate() {
    let minDate = this.options.minDate;
    if (minDate != "") {
      if (typeof minDate === "string") {
        const dt = parser_default(minDate, this.dateFormat);
        if (!dt) {
          return -1;
        }
        minDate = dt;
      }
      this.minYear = minDate.getFullYear();
      this.minMonth = +(this.minYear + utils_default.pad(minDate.getMonth(), 2));
      return new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate(), 0, 0).getTime();
    }
    return -1;
  }
  _maxDate() {
    let maxDate = this.options.maxDate;
    if (maxDate != "") {
      if (typeof maxDate === "string") {
        const dt = parser_default(maxDate, this.dateFormat);
        if (!dt) {
          return -1;
        }
        maxDate = dt;
      }
      this.maxYear = maxDate.getFullYear();
      this.maxMonth = +(this.maxYear + utils_default.pad(maxDate.getMonth(), 2));
      return new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 23, 59).getTime();
    }
    return -1;
  }
  set viewMode(mode) {
    if (this._viewMode === mode) {
      return;
    }
    this._viewMode = mode;
    this.changeViewMode(mode);
  }
  get viewMode() {
    return this._viewMode;
  }
  /**
   * 모드  change
   * @param mode 
   */
  changeViewMode(mode) {
    this.datetimeElement.querySelector(".ddtp-datetime")?.setAttribute("view-mode", mode);
    if (mode === "year") {
      this.yearDraw();
    } else if (mode === "month") {
      this.monthDraw();
    } else {
      this.dayDraw();
    }
  }
  initHeaderEvent() {
    this.datetimeElement.querySelector(".ddtp-move-btn.prev")?.addEventListener("click", (e) => {
      this.moveDate("prev");
    });
    this.datetimeElement.querySelector(".ddtp-move-btn.next")?.addEventListener("click", (e) => {
      this.moveDate("next");
    });
    this.datetimeElement.querySelector(".ddtp-header-year")?.addEventListener("click", (e) => {
      this.viewMode = "year" /* year */;
    });
    this.datetimeElement.querySelector(".ddtp-header-month")?.addEventListener("click", (e) => {
      this.viewMode = "month" /* month */;
    });
  }
  /**
   * 날짜 달력 이벤트처리.
   */
  initDateEvent() {
    this.datetimeElement.querySelector(".ddtp-day-body")?.addEventListener("click", (e) => {
      const targetEle = e.target;
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
        this.dateChangeEvent();
      }
    });
  }
  isTimeMode() {
    return this._viewMode === "time" /* time */ || this._viewMode === "datetime" /* datetime */;
  }
  /**
   * 시간 분 설정 이벤트 처리.
   *
   * @public
   */
  initTimeEvent() {
    if (!this.isTimeMode())
      return;
    let hh = this.currentDate.format("HH");
    const hourInputEle = this.datetimeElement.querySelector(".ddtp-hour");
    const hourRangeEle = this.datetimeElement.querySelector(".ddtp-hour-range");
    hourInputEle.value = hh;
    hourRangeEle.value = hh;
    hourInputEle.addEventListener("input", (e) => {
      const targetElement = e.target;
      const addVal = utils_default.pad(targetElement.value, 2);
      hourInputEle.value = addVal;
      hourRangeEle.value = addVal;
    });
    hourRangeEle.addEventListener("input", (e) => {
      const targetElement = e.target;
      hourInputEle.value = utils_default.pad(targetElement.value, 2);
    });
    let mm = this.currentDate.format("mm");
    const minuteInputEle = this.datetimeElement.querySelector(".ddtp-minute");
    const minuteRangeEle = this.datetimeElement.querySelector(".ddtp-minute-range");
    minuteInputEle.value = mm;
    minuteRangeEle.value = mm;
    minuteInputEle.addEventListener("input", (e) => {
      const targetElement = e.target;
      const addVal = utils_default.pad(targetElement.value, 2);
      minuteInputEle.value = addVal;
      minuteRangeEle.value = addVal;
    });
    minuteRangeEle.addEventListener("input", (e) => {
      const targetElement = e.target;
      minuteInputEle.value = utils_default.pad(targetElement.value, 2);
    });
    this.datetimeElement.querySelector(".time-select")?.addEventListener("click", (e) => {
      this.currentDate.setHour(+hourInputEle.value);
      this.currentDate.setMinutes(+minuteInputEle.value);
      this.dateChangeEvent();
    });
    this.datetimeElement.querySelector(".time-today")?.addEventListener("click", (e) => {
      const initDate = new DaraDate(parser_default(this.initialDate, this.dateFormat) || /* @__PURE__ */ new Date());
      this.currentDate.setYear(initDate.getYear());
      this.currentDate.setMonth(initDate.getMonth() - 1);
      this.currentDate.setDate(initDate.getDate());
      this.changeViewMode(this.initMode);
    });
  }
  /**
   * 날짜 이동
   * @param moveMode // 앞뒤 이동 prev, next
   * @returns 
   */
  moveDate(moveMode) {
    if (this._viewMode === "date" /* date */ || this._viewMode === "datetime" /* datetime */) {
      this.currentDate.addMonth("prev" === moveMode ? -1 : 1);
      this.dayDraw();
      return;
    }
    if (this._viewMode === "month" /* month */) {
      this.currentDate.addYear("prev" === moveMode ? -1 : 1);
      this.monthDraw();
      return;
    }
    if (this._viewMode === "year" /* year */) {
      this.currentDate.addYear("prev" === moveMode ? -16 : 16);
      this.yearDraw();
    }
  }
  /**
   * get date value
   * 
   * @returns 
   */
  getDateValue() {
    return this.currentDate.format(this.dateFormat);
  }
  /**
   * 옵션 셋팅
   * @static
   * @param {DateTimePickerOptions} options
   */
  static setOptions(options) {
    DEFAULT_OPTIONS = Object.assign({}, DEFAULT_OPTIONS, options);
  }
  /**
   * 달력 보이기 처리. 
   * 
   * @returns 
   */
  show() {
    if (this.isVisible) {
      return;
    }
    this.isVisible = true;
    const docHeight = getDocHeight();
    this.datetimeElement.classList.remove("hide");
    this.datetimeElement.classList.add("show");
    const rect = this.targetElement.getBoundingClientRect();
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    const scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
    const offsetTop = rect.top + scrollTop;
    let top = offsetTop + this.targetElement.offsetHeight + 2;
    const left = rect.left + scrollLeft;
    if (top + this.datetimeElement.offsetHeight > docHeight) {
      const newTop = offsetTop - (this.datetimeElement.offsetHeight + 2);
      top = newTop > 0 ? newTop : top;
    }
    console.log(this.targetElement, top, left, offsetTop, docHeight);
    this.datetimeElement.setAttribute("style", `top:${top}px;left:${left}px;z-index:${this.options.zIndex}`);
    document.addEventListener("click", this._documentClickEvent);
  }
  /**
   * 달력 숨기기
   */
  hide() {
    this.isVisible = false;
    this.datetimeElement.classList.remove("show");
    this.datetimeElement.classList.add("hide");
    document.removeEventListener("click", this._documentClickEvent);
  }
  /**
   * 타켓 이벤트 처리.
   */
  initTargetEvent() {
    if (this.targetElement) {
      this.targetElement.addEventListener("click", (e) => {
        this.show();
      });
      let beforeDt = this.options.initialDate;
      this.targetElement.addEventListener("blur1", (e) => {
        const val = e.target.value;
        if (val == beforeDt) {
          return;
        }
        this.dateChangeEvent();
      });
    }
  }
  dateChangeEvent() {
    const formatValue = this.currentDate.format(this.dateFormat);
    if (this.options.onChange) {
      if (this.options.onChange(formatValue) === false) {
        return;
      }
      ;
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
  createDatetimeTemplate() {
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
                            <td class="ddtp-day-label sun red">${Lanauage_default.getWeeksMessage(0)}</td>		
                            <td class="ddtp-day-label">${Lanauage_default.getWeeksMessage(1)}</td>		
                            <td class="ddtp-day-label">${Lanauage_default.getWeeksMessage(2)}</td>		
                            <td class="ddtp-day-label">${Lanauage_default.getWeeksMessage(3)}</td>		
                            <td class="ddtp-day-label">${Lanauage_default.getWeeksMessage(4)}</td>		
                            <td class="ddtp-day-label">${Lanauage_default.getWeeksMessage(5)}</td>		
                            <td class="ddtp-day-label sat">${Lanauage_default.getWeeksMessage(6)}</td>		
                        </tr>
                    </thead>
                    <tbody class="ddtp-day-body">
                    </tbody>
                    
                    <tfoot class="ddtp-day-footer">
                        <td colspan="7"><div class="footer-tooltip"></div></td>
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
                            <button type="button" class="time-select">${Lanauage_default.getMessage("ok")}</button>
                            <button type="button" class="time-today">${Lanauage_default.getMessage("today")}</button>
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
  yearDraw() {
    const currentYear = this.currentDate.format("YYYY");
    const startYear = +currentYear - 8;
    this.datetimeElement.querySelector(".ddtp-header-year").textContent = `${startYear} ~ ${startYear + 15}`;
    const calHTML = [];
    for (let i = 0; i < 16; i++) {
      const year = startYear + i;
      const disabled = this.isYearDisabled(year);
      calHTML.push(`<div class="ddtp-year ${disabled ? "disabled" : ""}" data-year="${year}">${year}</div>`);
    }
    this.datetimeElement.querySelector(".ddtp-years").innerHTML = calHTML.join("");
    this.datetimeElement.querySelectorAll(".ddtp-year")?.forEach((yearEle) => {
      yearEle.addEventListener("click", (e) => {
        const targetEle = e.target;
        if (targetEle) {
          const year = targetEle.getAttribute("data-year");
          if (year) {
            const numYear = +year;
            if (this.initMode == "year" /* year */) {
              if (this.isYearDisabled(numYear)) {
                return;
              }
              this.currentDate.setYear(numYear);
              this.dateChangeEvent();
              return;
            }
            this.currentDate.setYear(numYear);
            this.viewMode = "month" /* month */;
          }
        }
      });
    });
  }
  /**
   * 월 달력 그리기
   */
  monthDraw() {
    const year = this.currentDate.format("YYYY");
    this.datetimeElement.querySelector(".ddtp-header-year").textContent = year;
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
    this.datetimeElement.querySelector(".ddtp-header-month").textContent = this.currentDate.format("MMMM");
    const calHTML = [];
    for (let i = 0; i < 12; i++) {
      const disabled = this.isMonthDisabled(+year, i);
      calHTML.push(`<div class="ddtp-month ${disabled ? "disabled" : ""}" data-month="${i}">${Lanauage_default.getMonthsMessage(i, "abbr")}</div>`);
    }
    this.datetimeElement.querySelector(".ddtp-months").innerHTML = calHTML.join("");
    this.datetimeElement.querySelectorAll(".ddtp-month")?.forEach((monthEle) => {
      monthEle.addEventListener("click", (e) => {
        const targetEle = e.target;
        if (targetEle) {
          const month = targetEle.getAttribute("data-month");
          if (month) {
            if (this.initMode == "month" /* month */) {
              if (this.isMonthDisabled(this.currentDate.getYear(), +month)) {
                return;
              }
              this.currentDate.setMonth(+month);
              this.dateChangeEvent();
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
  dayDraw() {
    const dateFormat = this.dateFormat;
    let monthFirstDate = new DaraDate(parser_default(this.currentDate.format("YYYY-MM-01"), "YYYY-MM-DD") || /* @__PURE__ */ new Date());
    this.datetimeElement.querySelector(".ddtp-header-year").textContent = monthFirstDate.format("YYYY");
    this.datetimeElement.querySelector(".ddtp-header-month").textContent = monthFirstDate.format("MMMM");
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
      const tooltipDt = dateItem.format(dateFormat);
      if (i % 7 == 0) {
        calHTML.push((i == 0 ? "" : "</tr>") + "<tr>");
      }
      let disabled = this.isDayDisabled(dateItem);
      calHTML.push(`<td class="ddtp-day ${i % 7 == 0 ? "red" : ""} ${this.initialDate == tooltipDt ? "today" : ""} ${disabled ? "disabled" : ""}" data-day="${dateItem.format("M,D")}">`);
      calHTML.push(`${dateItem.format("d")}`);
      calHTML.push("</td>");
    }
    calHTML.push("</tr>");
    this.datetimeElement.querySelector(".ddtp-day-body").innerHTML = calHTML.join("");
  }
  isDayDisabled(dateItem) {
    if (this.minDate != -1 && this.minDate > dateItem.getTime() || this.maxDate != -1 && this.maxDate < dateItem.getTime()) {
      return true;
    }
    return false;
  }
  isYearDisabled(year) {
    if (this.minYear != -1 && this.minYear > year || this.maxYear != -1 && this.maxYear < year) {
      return true;
    }
    return false;
  }
  isMonthDisabled(year, month) {
    if (this.isYearDisabled(year)) {
      return true;
    }
    let yearMonth = +(year + utils_default.pad(month, 2));
    if (this.minMonth != -1 && this.minMonth > yearMonth || this.maxMonth != -1 && this.maxMonth < yearMonth) {
      return true;
    }
    return false;
  }
  static setMessage(message) {
    Lanauage_default.setDefaultMessage(message);
  }
};
function getDocHeight() {
  const doc = document;
  return Math.max(
    doc.body.scrollHeight,
    doc.documentElement.scrollHeight,
    doc.body.offsetHeight,
    doc.documentElement.offsetHeight,
    doc.body.clientHeight,
    doc.documentElement.clientHeight
  );
}

// src/index.ts
var DaraDateTimePicker = DateTimePicker;
export {
  DaraDateTimePicker
};
//# sourceMappingURL=index.js.map

import { Message } from "@t/Message";

let localeMessage: Message = {
  year: "Year",
  month: "Month",
  day: "Day",
  am: "AM",
  pm: "PM",
  today: "Today",
  ok: "Ok",
  months: {
    full: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    abbr: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
  weeks: {
    full: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    abbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
};

/**
 * validation 메시지 처리.
 *
 * @class Language
 * @typedef {Language}
 */
class Language {
  private lang: Message = localeMessage;

  public setDefaultMessage(lang?: Message) {
    localeMessage = Object.assign(localeMessage, lang);
  }

  /**
   * 다국어 메시지 등록
   *
   * @public
   * @param {?Message} [lang] 둥록할 메시지
   */
  public set(lang?: Message) {
    this.lang = Object.assign({}, localeMessage, lang);
  }

  /**
   * 메시지 얻기
   *
   * @public
   * @param {string} messageKey 메시지 키
   * @returns {*}
   */
  public getMessage(messageKey: string): any {
    return (this.lang as any)[messageKey];
  }

  public getMonthsMessage(idx: number, mode: "full" | "abbr" = "abbr") {
    return (this.lang.months as any)[mode][idx] || "";
  }

  public getWeeksMessage(idx: number, mode: "full" | "abbr" = "abbr") {
    return (this.lang.weeks as any)[mode][idx] || "";
  }

  public getMonthsIdx(val: string, mode: "full" | "abbr" = "abbr"): number {
    return mode == "full" ? this.lang.months.full.indexOf(val) : this.lang.months.abbr.indexOf(val);
  }

  public getWeeksIdx(val: string, mode: "full" | "abbr" = "abbr"): number {
    return mode == "full" ? this.lang.weeks.full.indexOf(val) : this.lang.weeks.abbr.indexOf(val);
  }
}

function message(msgFormat: string, msgParam: any): string {
  return msgFormat.replace(/\{{1,1}([A-Za-z0-9_.]*)\}{1,1}/g, (match, key) => {
    return typeof msgParam[key] !== "undefined" ? msgParam[key] : match;
  });
}

export default new Language();

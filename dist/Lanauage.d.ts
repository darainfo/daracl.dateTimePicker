import { Message } from "@t/Message";
/**
 * validation 메시지 처리.
 *
 * @class Language
 * @typedef {Language}
 */
declare class Language {
    private lang;
    setDefaultMessage(lang?: Message): void;
    /**
     * 다국어 메시지 등록
     *
     * @public
     * @param {?Message} [lang] 둥록할 메시지
     */
    set(lang?: Message): void;
    /**
     * 메시지 얻기
     *
     * @public
     * @param {string} messageKey 메시지 키
     * @returns {*}
     */
    getMessage(messageKey: string): any;
    getMonthsMessage(idx: number, mode?: 'full' | 'abbr'): any;
    getWeeksMessage(idx: number, mode?: 'full' | 'abbr'): any;
    getMonthsIdx(val: string, mode?: 'full' | 'abbr'): number;
    getWeeksIdx(val: string, mode?: 'full' | 'abbr'): number;
}
declare const _default: Language;
export default _default;

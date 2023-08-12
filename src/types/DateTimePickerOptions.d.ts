import { DateViewMode } from "src/constants";

export interface OptionCallback {
    (...params: any[]): any;
}

export interface DateTimePickerOptions {
    isEmbed: boolean		// layer or innerhtml
    , initialDate: string | Date // 초기화 요일
    , mode: DateViewMode
    , headerOrder: string
    , format: string
    , zIndex: number
    , autoClose: boolean
    , minDate: string | Date // 초기화 요일
    , maxDate: string | Date // 초기화 요일
    , onLoad?: OptionCallback
    , onChange?: OptionCallback

}

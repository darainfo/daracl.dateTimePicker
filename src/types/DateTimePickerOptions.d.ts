import { DateViewMode } from "src/constants";

export interface OptionCallback {
  (...params: any[]): any;
}

export interface DateTimePickerOptions {
  isEmbed: boolean; // layer or innerhtml
  initialDate: string | Date; // 초기화 요일
  mode: DateViewMode;
  firstDay: number; // 첫번째 요일 0:일, 1:월, 2:화, 3:수, 4:목, 5:금, 6:토
  showMonthAfterYear: boolean;
  format: string;
  zIndex: number;
  enableTodayBtn: boolean; // today button 보일지 여부.
  autoClose: boolean;
  minDate: string | Date; // 초기화 요일
  maxDate: string | Date; // 초기화 요일
  onLoad?: OptionCallback;
  onSelect?: OptionCallback;
  onChangeDatepicker?: OptionCallback;
  onClose?: OptionCallback;
  addStyleClass?: OptionCallback;
}

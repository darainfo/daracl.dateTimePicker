declare const _default: {
    replace(str: string): string;
    unReplace(inputText: string): string;
    unFieldName(fieldName: string): string;
    isBlank(value: any): boolean;
    isUndefined(value: any): value is undefined;
    isFunction(value: any): boolean;
    isString(value: any): value is string;
    isNumber(value: any): value is number;
    isArray(value: any): boolean;
    getHashCode(str: string): number;
    pad(str: any, length: number): string;
    closestElement(el: HTMLElement, checkElement: Element): boolean;
};
export default _default;

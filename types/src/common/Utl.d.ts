export = Utl;
/**
 * @description Allow different data type conversions.
 * @module common
 */
declare class Utl {
    static "__#13@#instance": any;
    static self(): any;
    set config(options: {
        number: {
            decimals: string;
            separator: string;
        };
        defaultValue: string;
        cleanValue: string;
    });
    get config(): {
        number: {
            decimals: string;
            separator: string;
        };
        defaultValue: string;
        cleanValue: string;
    };
    /**
     * @description escape all characters used as symbols in a regular expression
     * @param {String|RegExp} str
     * @returns {String|RegExp} result
     */
    escapeRegExp(str: string | RegExp): string | RegExp;
    /**
     * @description For legacy code. Replace all instances of a substring in a string, using a regular expression or search string.
     * @param {String} str
     * @param {String|RegExp} [find] A string to search for.
     * @param {String} [replace] A string containing the text to replace for every successful match of searchValue in this string.
     * @returns {String}
     */
    replace(str: string, find?: string | RegExp, replace?: string): string;
    /**
     * @description get the marging value among two numbers
     * @param {String|Number} max
     * @param {String|Number} min
     * @param {Boolean} sign [false]
     * @returns {Number}
     */
    getDelta(max: string | number, min: string | number, sign?: boolean): number;
    /**
     * @description get the sign from a number
     * @param {String|Number} value
     * @param {Boolean} all
     * @returns {String} Sing
     */
    getSign(value: string | number, all?: boolean): string;
    /**
     * @description get a valid value for boolean format
     * @param {String|Number|Boolean|Object|Array} value
     * @returns {Boolean}
     */
    asBoolean(value: string | number | boolean | any | any[], strict?: boolean): boolean;
    /**
     * @description check a valid value for number format
     * @param {String|Number} value
     * @returns {Boolean}
     */
    isNumber(value: string | number): boolean;
    /**
     * @description check id the value is not a number
     * @param {String|Number} value
     * @returns {Boolean}
     */
    isNaN(value: string | number): boolean;
    /**
     * @description check a valid value
     * @param {String|Number} value
     * @param {String|Number} defaultValue
     * @returns {Boolean}
     */
    isValid(value: string | number, defaultValue?: string | number): boolean;
    /**
     * @description get a valid value, avoiding a default and empty value
     * @param {String|Number} value
     * @param {String|Number} defaultValue
     * @returns {String|Number}
     */
    clean(value: string | number, defaultValue?: string | number): string | number;
    /**
     * @description clear string
     * @param {String} value
     * @returns value
     */
    clear(value: string): string;
    /**
     * @description Transform a text string using Snake Case notation
     * @param {String} str
     * @returns {String} str
     */
    toSnakeCase(str: string): string;
    /**
     * @description Transform a text string using Camel Case notation
     * @param {String} str
     * @returns {String} str
     */
    toCamelCase(str: string): string;
    /**
     * @description get a valid number
     * @param {String|Number} value
     * @param {Object} [config]
     * @returns {Number} Number
     */
    asNumber(value: string | number, config?: any): number;
    /**
     * @description convert string to number
     * @param {String} value
     * @param {Object} [config]
     * @param {String} [config.separator]
     * @param {String} [config.decimals]
     * @param {String} [config.force]
     * @param {String} [config.cleanValue]
     * @param {String} [config.defaultValue]
     * @returns {String} number
     */
    asNumberFormat(value: string, config?: {
        separator?: string;
        decimals?: string;
        force?: string;
        cleanValue?: string;
        defaultValue?: string;
    }): string;
    /**
     * @description add thousands separators
     * @param {String|Number} value
     * @param {Object} [options]
     * @returns {String} Number
     */
    addNumberSeparator(value: string | number, options?: any): string;
    /**
     * @description Get a decimal round based on the decimal amount
     * @param {String|Number} value
     * @param {Object} [config]
     * @param {String} [config.separator]
     * @param {String} [config.decimals]
     * @param {String} [config.force]
     * @param {String} [config.cleanValue]
     * @param {String} [config.defaultValue]
     * @param {String|Number} [config.format]
     * @param {String|Number} [config.window]
     * @returns {String|Number}
     */
    round(value: string | number, config?: {
        separator?: string;
        decimals?: string;
        force?: string;
        cleanValue?: string;
        defaultValue?: string;
        format?: string | number;
        window?: string | number;
    }): string | number;
    /**
     * @description Pads the current string/number with a given value (possibly repeated) so that the resulting string reaches a given length.
     * @param {String|Number} src
     * @param {Number} length
     * @param {String|Number} value
     * @param {String} defaults
     * @returns {String} Result
     */
    padSrt(src: string | number, length?: number, value?: string | number, defaults?: string): string;
    /**
     * @description create a simple object map
     * @param {Array} lst
     * @param {Function} getIndex
     * @param {Function} getValue
     * @returns
     */
    asMap(lst: any[], getIndex: Function, getValue: Function): any;
    /**
     * @description deep clone object
     * @param {Object} obj
     * @param {Object} base
     * @returns {Object} result
     */
    clone(obj: any, ...base: any): any;
    /**
     * @description check if there is any difference between obj and base
     * @param {Object} obj
     * @param {Object} base
     * @returns {Boolean} different
     */
    isDifferent(obj: any, base: any): boolean;
    /**
     * @description truncate a string based on max of characters
     * @param {String} str
     * @param {Number} maxLength
     * @param {Object} options
     * @returns {String} value
     */
    truncate(str: string, maxLength: number, { side, ellipsis }?: any): string;
    /**
     * @description Provide modern functionality on older nodejs version that do not natively support it.
     */
    polyfill(): void;
    /**
     * @description perform a smart search by key/RegEx in an object
     * @param {String} key
     * @param {Object} obj
     * @returns {*} Value
     */
    search(key: string, obj: any, opt: any): any;
    /**
     * @description get all request params [POST, GET, Path]
     * @param {Object} req
     * @param {Object} option
     * @param {Array|Boolean} [option.clean]
     * @param {String|Function} [option.type]
     * @param {Object|Array|String} [option.key]
     * @returns {Object} params
     */
    getFrom(req: any, option: {
        clean?: any[] | boolean;
        type?: string | Function;
        key?: any | any[] | string;
    }): any;
    /**
     * @description avaluate any key from opt into src
     * @param {Object} opt
     * @param {String} key
     * @param {Object} org
     * @returns {Object} opt
     */
    from(opt: any, key?: string, org?: any): any;
    /**
     * @description Define if child array is contained into a parent array
     * @param {Array} parent
     * @param {Array} child
     * @param {Function|null} [check]
     * @returns {Array} contained items
     */
    contains(child: any[], parent: any[], check?: Function | null): any[];
    /**
     * @description get all request params [POST, GET, Path]
     * @param {Object} req
     * @param {Object} req.params
     * @param {Object} req.query
     * @param {Object} req.body
     * @returns {Object} params
     */
    mixReq(req: {
        params: any;
        query: any;
        body: any;
    }): any;
    /**
     * @description trasform objects using delegates
     * @param {*} obj
     * @param {Object} delegate
     * @returns {*}
     */
    transform(obj: any, delegate?: any, key?: any): any;
    #private;
}

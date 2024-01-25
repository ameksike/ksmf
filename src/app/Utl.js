/**
 * @description Allow different data type conversions.
 * @module utils/Utl 
 */
class Utl {
    #config = {
        number: { decimals: ",", separator: "." },
        defaultValue: "-",
        cleanValue: ""
    }

    get config() {
        return this.#config;
    }

    set config(options) {
        this.#config.number = options?.number || this.config.number;
        this.#config.defaultValue = options?.defaultValue ?? this.config.defaultValue;
        this.#config.cleanValue = options?.cleanValue ?? this.config.cleanValue;
    }

    /**
     * @description escape all characters used as symbols in a regular expression
     * @param {String} str 
     * @returns {String} result
     */
    escapeRegExp(str) {
        return (typeof (str) === "string" && str) ? str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : str;
    }

    /**
     * @description For legacy code. Replace all instances of a substring in a string, using a regular expression or search string.
     * @param {String} str 
     * @param {String|RegExp} [find] A string to search for.
     * @param {String} [replace] A string containing the text to replace for every successful match of searchValue in this string.
     * @returns {String}
     */
    replace(str, find, replace = "") {
        if (typeof (str) !== "string" || !str || !find) {
            return str;
        }
        return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
    }

    /**
     * @description get the marging value among two numbers
     * @param {String|Number} max 
     * @param {String|Number} min 
     * @param {Boolean} sign [false]
     * @returns {Number}
     */
    getDelta(max, min, sign = false) {
        max = this.asNumber(max);
        min = this.asNumber(min);
        return ((!max && max !== 0) || (!min && min !== 0)) ? null : (sign ? max - min : Math.abs(max - min));
    }

    /**
     * @description get the sign from a number 
     * @param {String|Number} value 
     * @param {Boolean} all 
     * @returns {String} Sing
     */
    getSign(value, all = true) {
        if (!value) {
            return "";
        }
        return parseFloat(value) > 0 ? "+" : (all ? "-" : "");
    }

    /**
     * @description get a valid value for boolean format 
     * @param {String|Number|Boolean} value 
     * @returns {Boolean}
     */
    asBoolean(value, strict = true) {
        if (typeof (value) === "string") {
            value = value.trim();
            value = !(!value || value.toLowerCase() === "false");
        }
        if (strict && value && typeof (value) === "object") {
            value = Array.isArray(value) ? value.length : (Object.keys(value).length + Object.getOwnPropertySymbols(value).length);
        }
        return !!value;
    }

    /**
     * @description check a valid value for number format 
     * @param {String|Number} value 
     * @returns {Boolean}
     */
    isNumber(value) {
        return !isNaN(value) && value !== null && value !== undefined && value !== "";
    }

    /**
     * @description check a valid value 
     * @param {String|Number} value 
     * @param {String|Number} defaultValue 
     * @returns {Boolean}
     */
    isValid(value, defaultValue = null) {
        defaultValue = defaultValue ?? this.config.defaultValue;
        return ![defaultValue, "", " ", undefined, null].includes(value);
    }

    /**
     * @description get a valid value, avoiding a default and empty value 
     * @param {String|Number} value 
     * @param {String|Number} defaultValue 
     * @returns {String|Number}
     */
    clean(value, defaultValue = null) {
        defaultValue = defaultValue ?? this.config.defaultValue;
        if (typeof (value) === "string") {
            value = value.trim();
        }
        return [defaultValue, "", undefined].includes(value) ? null : value;
    }

    /**
     * @description clear string
     * @param {String} value 
     * @returns value
     */
    clear(value) {
        if (typeof value === "string") {
            return value.replace(/\\r|\r|\n|\\n/g, "").replace(/(\s{2,})/g, " ");
        }
        return value;
    }

    /**
     * @description get a valid number 
     * @param {String|Number} value 
     * @param {Object} [config] 
     * @returns {Number} Number 
     */
    asNumber(value, config) {
        config = config ?? this.config.number;
        value = this.asNumberFormat(value, config);
        return this.isNumber(value) ? parseFloat(value) : null;
    }

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
    asNumberFormat(value, config) {
        config = this.clone(this.config?.number, config || {});
        if (typeof (value) === "string") {
            if (config.separator !== ".") {
                value = this.replace(value, config.separator);
            } else {
                const hasDecimals = value.includes(config.decimals);
                if (hasDecimals || (!hasDecimals && !config.force)) {
                    value = this.replace(value, config.separator);
                }
            }
            if (config.decimals !== ".") {
                value = this.replace(value, config.decimals, ".");
            }
            value = this.replace(value, ",", ".");
            value = value === config.defaultValue ? config.cleanValue : value;
        }
        return value;
    }

    /**
     * @description add thousands separators
     * @param {String|Number} value 
     * @param {Object} [options] 
     * @returns {String} Number
     */
    addNumberSeparator(value, options = null) {
        const { separator = ",", window = 3, integer = true } = options || {};
        function set(value, window, separator) {
            return value.replace(new RegExp(`\\B(?=(\\d{${window}})+(?!\\d))`, 'g'), separator);
        }
        value = String(value);
        if (integer) {
            const parts = value.split(".");
            parts[0] = set(parts[0], window, separator);
            return parts.join(".");
        } else {
            return set(value, window, separator);
        }
    }

    /**
     * @description Get a decimal round based on the decimal amount
     * @param {String|Number} value 
     * @param {Object} [config] 
     * @param {String|Number} [config.decimals] 
     * @param {String|Number} [config.format] 
     * @param {String|Number} [config.window] 
     * @returns {String|Number}
     */
    round(value, config) {
        config = this.clone(this.config.number, typeof (config) === "number" ? { window: config } : (config || {}));
        let { window, format = Number } = config;
        value = this.asNumberFormat(value, config);
        if (!this.isNumber(value)) {
            return null;
        }
        if (!this.isNumber(window)) {
            return value;
        }
        if (!(format instanceof Function)) {
            format = Number;
        }
        return format((Math.round(value * Math.pow(10, window)) / Math.pow(10, window)).toFixed(window));
    };

    /**
     * @description Pads the current string/number with a given value (possibly repeated) so that the resulting string reaches a given length. 
     * @param {String|Number} src 
     * @param {Number} length 
     * @param {String|Number} value 
     * @param {String} defaults 
     * @returns {String} Result
     */
    padSrt(src, length = 3, value = '0', defaults = "") {
        src = String(src ?? "");
        src = (src?.trim && src.trim()) ?? src;
        return src ? String(src).padStart(length, String(value)) : defaults;
    }

    /**
     * @description create a simple object map 
     * @param {Array} lst 
     * @param {Function} getIndex 
     * @param {Function} getValue 
     * @returns 
     */
    asMap(lst, getIndex, getValue) {
        return (lst?.reduce && lst)?.reduce((map, item, index) => {
            map[typeof (getIndex) === "function" ? getIndex(item, lst, index) : index] =
                typeof (getValue) === "function" ? getValue(item, lst, index) : item;
            return map;
        }, {});
    }

    /**
     * @description deep clone object
     * @param {Object} obj 
     * @param {Object} base 
     * @returns {Object} result
     */
    clone(obj, ...base) {
        const cryp = require('kscryp');
        return Object.assign(this.asBoolean(obj, true) ? cryp?.decode(cryp?.encode(obj, "json"), "json") : {}, ...base);
    }

    /**
     * @description check if there is any difference between obj and base
     * @param {Object} obj 
     * @param {Object} base 
     * @returns {Boolean} different
     */
    isDifferent(obj, base) {
        for (let i in base) {
            if (obj[i] !== base[i]) {
                return true;
            }
        }
        return false;
    }

    /**
     * @description truncate a string based on max of characters
     * @param {String} str 
     * @param {Number} maxLength 
     * @param {Object} options  
     * @returns {String} value
     */
    truncate(str, maxLength, { side = "end", ellipsis = "..." } = {}) {
        if (str.length > maxLength) {
            if (side === "start") {
                return ellipsis + str.slice(-(maxLength - ellipsis.length));
            } else {
                return str.slice(0, maxLength - ellipsis.length) + ellipsis;
            }
        }
        return str;
    }

    /**
     * @description Provide modern functionality on older nodejs version that do not natively support it. 
     */
    polyfill() {
        const _this = this;
        // String
        if (!(String.prototype.replaceAll instanceof Function)) {
            Object.defineProperty(String.prototype, 'replaceAll', {
                value: function (...arg) {
                    return _this.replace(this, ...arg);
                },
                enumerable: false
            });
        }
        // Array
        if (!(Array.prototype.at instanceof Function)) {
            Object.defineProperty(Array.prototype, 'at', {
                value: function (index) {
                    if (index >= this.length) {
                        return null;
                    }
                    if (index < 0) {
                        index = this.length + index
                    }
                    return this[index];
                },
                enumerable: false
            });
        }
    }

    /**
     * @description perform a smart search by key/RegEx in an object
     * @param {String} key 
     * @param {Object} obj 
     * @returns {*} Value 
     */
    search(key, obj, opt) {
        if (!obj) {
            return false;
        }
        if (obj[key]) {
            return obj[key];
        }
        function getRegExp(str) {
            try {
                return new RegExp(str);
            }
            catch (e) {
                return null;
            }
        }
        let exp = getRegExp(key);
        let lst = Object.keys(obj);
        let ind = lst.find(item => {
            if (opt?.reverse) {
                let prp = getRegExp(item);
                return prp && prp.test(key);
            } else {
                return exp && exp.test(item);
            }
        });
        return !ind ? false : obj[ind];
    }

    /**
     * @description get all request params [POST, GET, Path] 
     * @param {Object} req 
     * @param {Object} option 
     * @param {Array|Boolean} [option.clean] 
     * @param {String|Function} [option.type] 
     * @param {Object|Array|String} [option.key] 
     * @returns {Object} params
     */
    getFrom(req, option) {
        option = option || {};
        req = req || {};
        let act = type => typeof (type) === "function" ? type : (type && this["as" + type] ? this["as" + type] : null);
        // get data from a request object
        let opt = this.mixReq(req);
        if (req.files) {
            for (let i in req.files) {
                const file = req.files[i];
                file && (opt[file.fieldname] = file.buffer?.toString ? file.buffer.toString("utf8") : file.buffer);
            }
        }
        // clean up reserved keywords
        if (!req.body) {
            req.query && typeof (req.query) === "object" && (delete opt["query"]);
            req.params && typeof (req.params) === "object" && (delete opt["params"]);
        }
        // perform filtering and type transformation
        let exe = act(option.type);
        if (option.key) {
            if (typeof (option.key) === "string") {
                return exe ? exe.apply(this, [opt[option.key], option]) : opt[option.key];
            }
            if (Array.isArray(option.key)) {
                return option.key.reduce((store, i) => {
                    store[i] = exe ? exe.apply(this, [opt[i], option]) : opt[i];
                    return store
                }, {});
            }
        }
        if (option?.clean) {
            option.clean = option.clean && Array.isArray(option.clean) ? option.clean : [undefined, ""];
            for (let i in opt) {
                if (option.clean.includes(opt[i])) {
                    delete opt[i];
                }
                if (option?.key && option.key[i]) {
                    exe = act(option.key[i]) || exe;
                    opt[i] = exe ? exe.apply(this, [opt[i], option]) : opt[i];
                }
            }
        }
        return opt;
    }

    /**
     * @description avaluate any key from opt into src 
     * @param {Object} opt 
     * @param {String} key
     * @param {Object} org 
     * @returns {Object} opt
     */
    from(opt, key = "env", org = process) {
        if (!opt || !org || !org[key]) {
            return {};
        }
        let src = org[key];
        let tmp = { ...opt }
        for (let i in tmp) {
            if (src[tmp[i]]) {
                tmp[i] = src[tmp[i]];
            }
        }
        return tmp;
    }

    /**
     * @description Define if child array is contained into a parent array
     * @param {Array} parent 
     * @param {Array} child 
     * @param {Function|null} [check] 
     * @returns {Array} contained items
     */
    contains(child, parent, check = null) {
        if (!child) {
            return [];
        }
        child = Array.isArray(child) ? child : [child];
        if (!parent.length) {
            return [];
        }
        check = check instanceof Function ? check : ((item, lst) => lst.includes(item));
        return child.filter(item => check(item, parent));
    }

    /**
     * @description get all request params [POST, GET, Path] 
     * @param {Object} req 
     * @param {Object} req.params
     * @param {Object} req.query
     * @param {Object} req.body 
     * @returns {Object} params
     */
    mixReq(req) {
        return { ...req.params || {}, ...req.query || {}, ...req.body || req };
    }

    static #instance;
    static self() {
        if (!this.#instance) {
            this.#instance = new Utl();
        }
        return this.#instance;
    }
}

module.exports = Utl;
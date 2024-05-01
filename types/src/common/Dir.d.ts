export = Dir;
declare class Dir {
    /**
     * @param {Object} [option]
     */
    constructor(option?: any);
    /**
     * @type {Object}
     */
    cache: any;
    /**
     * @type {Number}
     */
    limit: number;
    /**
     * @type {Boolean}
     */
    recursive: boolean;
    /**
     * @type {Console|null}
     */
    logger: Console | null;
    /**
     * @description event to inspect a directory
     * @param {String} directory
     * @param {Function} callback
     * @param {Object} [option]
     * @param {Boolean} [option.read]
     * @param {Boolean} [option.watch]
     * @param {Boolean} [option.watchRecursive]
     * @param {Boolean} [option.readRecursive]
     * @param {Boolean} [option.active]
     * @param {Boolean} [option.onlyDir]
     * @param {Boolean} [option.onlyFile]
     * @param {Boolean} [option.info]
     * @param {Number} [option.limit]
     * @returns {Promise<{ data?: Array, directory: String, event: String}>}
     */
    on(directory: string, callback: Function, option?: {
        read?: boolean;
        watch?: boolean;
        watchRecursive?: boolean;
        readRecursive?: boolean;
        active?: boolean;
        onlyDir?: boolean;
        onlyFile?: boolean;
        info?: boolean;
        limit?: number;
    }): Promise<{
        data?: any[];
        directory: string;
        event: string;
    }>;
    /**
     * @description watch a directory
     * @param {String} directory
     * @param {Function} callback
     * @param {Object} [option]
     * @param {Boolean} [option.read]
     * @param {Boolean} [option.watch]
     * @param {Boolean} [option.watchRecursive]
     * @param {Boolean} [option.readRecursive]
     * @param {Boolean} [option.active]
     * @param {Boolean} [option.onlyDir]
     * @param {Boolean} [option.onlyFile]
     * @param {Boolean} [option.info]
     * @param {Number} [option.limit]
     */
    watch(directory: string, callback: Function, option?: {
        read?: boolean;
        watch?: boolean;
        watchRecursive?: boolean;
        readRecursive?: boolean;
        active?: boolean;
        onlyDir?: boolean;
        onlyFile?: boolean;
        info?: boolean;
        limit?: number;
    }): Promise<any>;
    /**
     * @description read a directory
     * @param {String} directory
     * @param {Function} callback
     * @param {Object} [option]
     * @param {Boolean} [option.read]
     * @param {Boolean} [option.watch]
     * @param {Boolean} [option.watchRecursive]
     * @param {Boolean} [option.readRecursive]
     * @param {Boolean} [option.active]
     * @param {Boolean} [option.onlyDir]
     * @param {Boolean} [option.onlyFile]
     * @param {Boolean} [option.info]
     * @param {Number} [option.limit]
     * @returns {Promise<{ data?: Array, directory: String, event: String}>}
     */
    read(directory: string, callback: Function, option?: {
        read?: boolean;
        watch?: boolean;
        watchRecursive?: boolean;
        readRecursive?: boolean;
        active?: boolean;
        onlyDir?: boolean;
        onlyFile?: boolean;
        info?: boolean;
        limit?: number;
    }): Promise<{
        data?: any[];
        directory: string;
        event: string;
    }>;
    #private;
}

/**
 * @author      Antonio Membrides Espinosa
 * @email       tonykssa@gmail.com
 * @date        20/05/2020
 * @copyright   Copyright (c) 2020-2035
 * @license     GPL
 * @version     1.0
 * @description For more information see: https://github.com/ameksike/ksmf/wiki  
 **/

const _fs = require('fs').promises;
const _path = require('path');

class Dir {
    /**
     * @type {Object}
     */
    cache;

    /**
     * @type {Number}
     */
    limit;

    /**
     * @type {Boolean}
     */
    recursive;

    /**
     * @type {Console|null}
     */
    logger = null;


    /**
     * @param {Object} [option] 
     */
    constructor(option = undefined) {
        this.cache = option?.cache || {};
        this.limit = option?.limit || 100;
        this.logger = option?.logger || 100;
        this.recursive = option?.recursive ?? false;
    }

    /**
     * @description track the event 
     * @param {Object} event 
     */
    #track(event) {
        event?.key && (this.cache[event.key] = {
            key: event.key,
            value: event.value,
            date: Date.now(),
            limit: event.limit || this.limit
        });
    }

    /**
     * @description avoid redundant signals
     * @param {Object} event 
     * @returns {Boolean} 
     */
    #cached(event) {
        if (!event?.active) {
            return false;
        }
        let tmp = this.cache[event.key];
        if (tmp?.date && (Date.now() - tmp.date) <= tmp.limit) {
            return true;
        }
        this.#track(event);
        return false;
    }

    /**
     * @description transform an event into a traceable element
     * @param {Object} event 
     * @param {Object} [option] 
     * @returns {Object} item
     */
    #format(event, option = undefined) {
        return {
            key: event.name,
            value: event,
            limit: option?.limit || this.limit,
            active: option?.active ?? true
        }
    }

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
    async on(directory, callback, option = undefined) {
        if (!directory) {
            return null;
        }
        (option?.watch || option.watch === undefined) && this.watch(directory, callback, option);
        return (option?.read || option.read === undefined) && this.read(directory, callback, option);
    }

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
    async watch(directory, callback, option = undefined) {
        if (!directory || !(callback instanceof Function)) {
            return null;
        }
        const watcher = _fs.watch(_path.resolve(directory), { recursive: option?.watchRecursive ?? this.recursive });
        for await (const event of watcher) {
            let item = {
                name: event.filename.split(_path.sep).shift(),
                delimiter: _path.sep,
                file: event.filename,
                event: event.eventType,
                directory
            };
            let wrap = this.#format(item, option);
            if ((event.eventType === 'rename' || event.eventType === 'change') && !this.#cached(wrap)) {
                callback(item);
            }
        }
    }

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
    async read(directory, callback, option = undefined) {
        try {
            const data = [];
            const files = await _fs.readdir(_path.resolve(directory), { recursive: option?.readRecursive ?? this.recursive });
            for (const file of files) {
                let check = option?.onlyDir || option?.onlyFile || option?.info;
                let stats = check ? await _fs.stat(_path.join(directory, file)) : null;
                let out = { name: file, directory, event: 'read_row' };
                if (stats) {
                    out.isDir = stats?.isDirectory();
                    out.size = stats?.size;
                    out.nlink = stats?.nlink;
                    out.uid = stats?.uid;
                    out.gid = stats?.gid;
                    out.atime = stats?.atime;
                    out.mtime = stats?.mtime;
                    out.ctime = stats?.ctime;
                    out.birthtime = stats?.birthtime;
                }
                if (stats && option?.onlyDir !== undefined && option?.onlyDir !== out.isDir) {
                    continue;
                }
                if (stats && option?.onlyFile !== undefined && option?.onlyFile === out.isDir) {
                    continue;
                }
                data.push(out);
                callback instanceof Function && callback(out);
            }
            return { data, directory, event: 'read_end' };
        } catch (error) {
            this.logger?.error instanceof Function && this.logger.error({
                flow: Date.now() + '00',
                src: "KsMf:Dir:read",
                error,
                data: { directory, option }
            });
        }
    }
}

module.exports = Dir;
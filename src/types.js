
/**
 * @template [T=object]
 * @typedef {{[name:String]:T}} TList 
 **/

/**
 * @typedef {Object} TAppConfig
 * @property {Object} [web]  
 * @property {Object} [drv]  
 * @property {Object} [server]  
 * @property {Object} [cookie]  
 * @property {Object} [session]  
 * @property {Object} [fingerprint]  
 * @property {Object} [cors]  
 * @property {Boolean} [force]  
 * @property {Object} [config] 
 * @property {Number} [code]
 * @property {Object} [module] 
 * @property {String} [mode]
 */

/**
 * @typedef {Object} TOption
 * @property {String} [name] 
 * @property {String} [type] 
 * @property {String} [mode] 
 * @property {Object} [options] 
 * @property {Object} [params] 
 * @property {Object} [dependency] 
 */

/**
 * @typedef {Object} TCLIArgReq
 * @property {String} [name] 
 * @property {String} [type] 
 * @property {Object} [options] 
 * @property {Object} [params] 
 * @property {Object} [dependency] 
 */

/**
 * @typedef {import('stream').Readable} TReadableStream
 * @typedef {import('stream').Writable} TWritableStream
 */

/**
 * @typedef {Object} TSearchOption
 * @property {Number} [page] 
 * @property {Number} [size] 
 * @property {Object} [order] 
 * @property {Object} [where] 
 * @property {Object} [query] 
 * @property {Object} [attributes] 
 */

module.exports = {};
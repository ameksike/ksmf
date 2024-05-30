
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
 */

/**
 * @typedef {Object} TOption
 * @property {String} [item.name] 
 * @property {String} [item.type] 
 * @property {Object} [item.options] 
 * @property {Object} [item.params] 
 * @property {Object} [item.dependency] 
 */

/**
 * @typedef {Object} TCLIArgReq
 * @property {String} [item.name] 
 * @property {String} [item.type] 
 * @property {Object} [item.options] 
 * @property {Object} [item.params] 
 * @property {Object} [item.dependency] 
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
const { create } = require('ipfs-http-client');
const { concat } = require('uint8arrays/concat');
const { toString } = require('uint8arrays/to-string');
const BufferList = require('bl/BufferList');

/**
 * @description Wraps the ipfs http library into a class.
 * Allows to instantiate an IPFS client object.
 */
class IPFSWrapper {
  /**
   * @description Creates an instance of IPFSWrapper.
   * @param {Object} host The IPFS host options
   */
  constructor(hostOptions) {
    if (hostOptions === undefined)
      throw new Error('wrapper/IPFSWrapper: Host options not set');
    this.hostOptions = hostOptions;
    this.ipfs = create(hostOptions);
  }

  /**
   * @description Adds a file to IPFS
   * @param {string} path The path to which append the file to add
   * @param {Object} file The object including name (path) and the file (content) to add
   * @param {Object} [options] The object for the add options
   */
  async storeIPFSFile(path, file, options) {
    file = JSON.parse(JSON.stringify(file));
    if (options === undefined) {
      options = {};
    }
    options = {
      ...options,
      wrapWithDirectory: true,
    };
    file.path = `${path}${file.path}`;

    const response = await this.ipfs.add(file, options);

    return response;
  }

  /**
   * @description Adds a file to IPFS
   * @param {string} path The path to which append the file to add
   * @param {Array} files The objects including name (path) and the file (content) to add
   * @param {Object} [options] The object for the addAll options
   */
  async storeIPFSDirectory(path, files, options) {
    files = JSON.parse(JSON.stringify(files));
    if (options === undefined) {
      options = {};
    }
    options = {
      ...options,
      wrapWithDirectory: true,
    };
    files.forEach((file) => {
      file.path = `${path}${file.path}`;
    });

    const response = [];
    for await (const res of this.ipfs.addAll(files, options)) {
      response.push(res);
    }

    return response;
  }

  /**
   * @description Gets the CIDs of some files
   * @param {string} path The path to which files should be appended to
   * @param {Array} files The objects including name (path) and the file (content) to get the CID
   */
  async getCIDs(path, files) {
    return await this.storeIPFSDirectory(path, files, {
      onlyHash: true,
    });
  }

  /**
   * @description Gets a file from IPFS
   * @param {string} path The path from where to get the file
   * @param {Object} [options] The object for the cat options
   */
  async getIPFSFile(path, options) {
    if (options === undefined) {
      options = {};
    }

    const response = [];
    for await (const res of this.ipfs.cat(path, options)) {
      response.push(res);
    }

    return toString(concat(response));
  }

  /**
   * @description Gets a directory from IPFS
   * @param {string} path The path from where to get the directory
   * @param {Object} [options] The object for the cat options
   */
  async getIPFSDirectory(path, options) {
    if (options === undefined) {
      options = {};
    }

    const response = [];
    for await (const file of this.ipfs.ls(path)) {
      response.push(await this.getIPFSFile(file.path));
    }

    return response;
    /*
    for await (let file of this.ipfs.get(path)) {
      file = toString(concat(file));
      console.log(file);

      const content = new BufferList();
      for await (const chunk of file.content) {
        content.append(chunk);
      }

      response.push(content.toString());
    }

    return toString(concat(response));*/
  }
}

module.exports = { IPFSWrapper };

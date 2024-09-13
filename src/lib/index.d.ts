export interface AppErrorResponseTypes {
  error: {
    message: string;
    status: number;
    stack: any;
  };
}
export interface IFullAppErrorResponse {
  error: {
    message: string;
    status: number;
    stack: any;
    date: string;
    os: {
      platform: string;
      release: string;
      type: string;
    };
    environment: {
      nodeVersion: string;
      env: string;
    };
    request:
      | {
          url: string;
          method: string;
          headers: any;
          body: any;
        }
      | undefined;
  };
}

export interface IDBConnectionOptions {
  dbName: string;
  port?: string;
  user?: string;
  password?: string;
  host?: string;
  uri?: string;
  options?: {
    [key: string]: any;
  };
}

export interface IBootstrapOptions {
  port?: number;
  name?: string;
  staticFolders?: IStaticFolder[];
  cors?: AppcorsProps;
  helmet?: {
    active: boolean;
    options?: any;
  };
  loggerFormat?: string;
  routes: Array<any>;
  routesPath: Array<{ path: string; middleware: Fucntion | null; routes: any }>;
  db: IDBConnectionOptions;
  urlencoded: OptionsUrlencoded;
  compression: CompressionOptions;
  errorsHandler?: Function;
  poweredBy?: string;
}

interface CompressionOptions {
  /**
   * @default zlib.constants.Z_DEFAULT_CHUNK or 16384
   * @see {@link https://nodejs.org/api/zlib.html#zlib_memory_usage_tuning| Node.js documentation}
   * @see {@link https://github.com/expressjs/compression#chunksize|chunkSize documentation}
   */
  chunkSize?: number | undefined;

  /**
   * A function to decide if the response should be considered for compression. This function is called as
   * `filter(req, res)` and is expected to return `true` to consider the response for compression, or `false` to
   * not compress the response.
   *
   * The default filter function uses the `compressible` module to determine if `res.getHeader('Content-Type')`
   * is compressible.
   *
   * @see {@link https://github.com/expressjs/compression#filter|`filter` documentation}
   * @see {@link https://www.npmjs.com/package/compressible|compressible module}
   */
  filter?: any;

  /**
   * The level of zlib compression to apply to responses. A higher level will result in better compression, but
   * will take longer to complete. A lower level will result in less compression, but will be much faster.
   *
   * This is an integer in the range of `0` (no compression) to `9` (maximum compression). The special value `-1`
   * can be used to mean the "default compression level", which is a default compromise between speed and
   * compression (currently equivalent to level 6).
   *
   * - `-1` Default compression level (also `zlib.constants.Z_DEFAULT_COMPRESSION`).
   * - `0` No compression (also `zlib.constants.Z_NO_COMPRESSION`).
   * - `1` Fastest compression (also `zlib.constants.Z_BEST_SPEED`).
   * - `2`
   * - `3`
   * - `4`
   * - `5`
   * - `6` (currently what `zlib.constants.Z_DEFAULT_COMPRESSION` points to).
   * - `7`
   * - `8`
   * - `9` Best compression (also `zlib.constants.Z_BEST_COMPRESSION`).
   *
   * **Note** in the list above, `zlib` is from `zlib = require('zlib')`.
   *
   * @default zlib.constants.DEFAULT_COMPRESSION or -1
   * @see {@link https://github.com/expressjs/compression#level|`level` documentation}
   */
  level?: number | undefined;

  /**
   * This specifies how much memory should be allocated for the internal compression state and is an integer in
   * the range of `1` (minimum level) and `9` (maximum level).
   *
   * @default zlib.constants.DEFAULT_MEMLEVEL or 8
   * @see {@link https://nodejs.org/api/zlib.html#zlib_memory_usage_tuning|Node.js documentation}
   * @see {@link https://github.com/expressjs/compression#memlevel|`memLevel` documentation}
   */
  memLevel?: number | undefined;

  /**
   * This is used to tune the compression algorithm. This value only affects the compression ratio, not the
   * correctness of the compressed output, even if it is not set appropriately.
   *
   * - `zlib.constants.Z_DEFAULT_STRATEGY` Use for normal data.
   * - `zlib.constants.Z_FILTERED` Use for data produced by a filter (or predictor). Filtered data consists mostly of small
   *   values with a somewhat random distribution. In this case, the compression algorithm is tuned to compress
   *   them better. The effect is to force more Huffman coding and less string matching; it is somewhat intermediate
   *   between `zlib.constants.Z_DEFAULT_STRATEGY` and `zlib.constants.Z_HUFFMAN_ONLY`.
   * - `zlib.constants.Z_FIXED` Use to prevent the use of dynamic Huffman codes, allowing for a simpler decoder for special applications.
   * - `zlib.constants.Z_HUFFMAN_ONLY` Use to force Huffman encoding only (no string match).
   * - `zlib.constants.Z_RLE` Use to limit match distances to one (run-length encoding). This is designed to be almost as
   *    fast as `zlib.constants.Z_HUFFMAN_ONLY`, but give better compression for PNG image data.
   *
   * **Note** in the list above, `zlib` is from `zlib = require('zlib')`.
   */
  strategy?: number | undefined;

  /**
   * The byte threshold for the response body size before compression is considered for the response, defaults to
   * 1kb. This is a number of bytes or any string accepted by the bytes module.
   *
   * **Note** this is only an advisory setting; if the response size cannot be determined at the time the response
   * headers are written, then it is assumed the response is *over* the threshold. To guarantee the response size
   * can be determined, be sure set a `Content-Length` response header.
   *
   * @see {@link https://www.npmjs.com/package/bytes|`bytes` module}
   * @see {@link https://github.com/expressjs/compression#threshold|`threshold` documentation}
   */
  threshold?: number | string | undefined;

  /**
   * @default zlib.constants.Z_DEFAULT_WINDOWBITS or 15.
   * @see {@link https://nodejs.org/api/zlib.html#zlib_memory_usage_tuning|Node.js documentation}
   */
  windowBits?: number | undefined;
  /**
   * In addition , `zlib` options may be passed in to the options object.
   */
  [property: string]: any;
}
interface OptionsUrlencoded {
  extended?: boolean | undefined;
  limit?: number | string | undefined;
}

export type IIP = string | undefined;

export type IRequiredHeader = { [key: string]: any };

export interface AppcorsProps {
  allowedDomains?: string[];
  allowedIPs?: string[];
  customHeaders?: string[];
  requiredHeaders?: IRequiredHeader[];
  methods?: string;
  allowedRoutes?: string[];
  callBack?: Function;
}

export type IStaticFolder = {
  folder: string;
  path: string;
};

export type IControllerMethods = "list" | "get" | "edit" | "create" | "update" | "delete";

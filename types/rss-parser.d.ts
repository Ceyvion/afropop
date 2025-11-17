declare module 'rss-parser' {
  export type ParserOptions<TFeed = any, TItem = any> = {
    customFields?: {
      feed?: Array<[string, keyof TFeed | string]>;
      item?: Array<[string, keyof TItem | string]>;
    };
    requestOptions?: RequestInit;
    headers?: Record<string, string>;
  };

  export default class Parser<TFeed = any, TItem = any> {
    constructor(options?: ParserOptions<TFeed, TItem>);
    parseURL(url: string): Promise<TFeed>;
    parseString(xml: string): Promise<TFeed>;
  }
}

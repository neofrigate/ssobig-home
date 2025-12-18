declare module "gray-matter" {
  interface GrayMatterFile<I = Record<string, unknown>> {
    data: I;
    content: string;
    excerpt?: string;
    orig: Buffer | string;
    language: string;
    matter: string;
    stringify(lang: string): string;
  }

  interface GrayMatterOption<I = Record<string, unknown>> {
    parser?: (str: string) => I;
    eval?: boolean;
    excerpt?:
      | boolean
      | ((file: GrayMatterFile<I>, options: GrayMatterOption<I>) => string);
    excerpt_separator?: string;
    engines?: Record<string, (str: string) => unknown>;
    language?: string;
    delimiters?: string | [string, string];
  }

  function matter<I = Record<string, unknown>>(
    file: string | Buffer,
    options?: GrayMatterOption<I>
  ): GrayMatterFile<I>;

  export = matter;
}

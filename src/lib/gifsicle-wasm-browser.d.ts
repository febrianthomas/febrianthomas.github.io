declare module "gifsicle-wasm-browser" {
  interface GifsicleInput {
    file: File | Blob | ArrayBuffer | string;
    name: string;
  }

  interface GifsicleOptions {
    input: GifsicleInput[];
    command: string[];
    folder?: string[];
    isStrict?: boolean;
  }

  const gifsicle: {
    run(options: GifsicleOptions): Promise<File[] | null>;
  };

  export default gifsicle;
}

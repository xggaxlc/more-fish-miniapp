declare var process: {
  env: {
    NODE_ENV: 'production' | 'development' | 'staging';
    IP: string;
    PORT: number;
  }
};
declare var require;
declare var IS_PRODUCTION: boolean;

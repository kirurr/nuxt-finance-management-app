export type AllString<T> = {
  [K in keyof T]: string;
};

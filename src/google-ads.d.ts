export {};

declare global {
  interface Window {
    adsbygoogle: {
      push(params: Record<string, any>): void;
    }[];
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    }
  }
} 
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
    gtag: (
      command: 'consent' | 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: any
    ) => void;
  }
}

export {};
declare module 'next' {
  export type Metadata = Record<string, any>;
  export type NextConfig = Record<string, any>;
}

declare module 'next/types.js' {
  export type RouteImpl<T> = any;
  export type ResolvingMetadata = any;
  export type ResolvingViewport = any;
}

declare module 'next/dist/lib/metadata/types/metadata-interface.js' {
  export type ResolvingMetadata = any;
  export type ResolvingViewport = any;
}

declare module 'next/dist/build/segment-config/app/app-segment-config.js' {
  export type InstantConfigForTypeCheckInternal = any;
  export type Prefetch = any;
  export type EnsureStatic = any;
}

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

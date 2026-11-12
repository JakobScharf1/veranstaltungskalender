/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** Optionale Überschreibung der Backend-URL */
    readonly VITE_API_URL?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

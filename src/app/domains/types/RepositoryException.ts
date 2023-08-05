export type RepositoryException = Error & { detail: string; constraint?: string };

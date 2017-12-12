export interface HTTPError {
    error: string;
    status?: number;
    headers?: { [name: string]: string };
}

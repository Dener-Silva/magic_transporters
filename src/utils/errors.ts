export class HTTPError extends Error {
    metadata: any[]
    constructor(public status: number, message: string, ...meta: any[]) {
        super(message);
        this.metadata = meta;
    }
}
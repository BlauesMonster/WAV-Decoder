
export class RIFFChunk{
    public ChunkID: string;
    public ChunkSize: number;
    public Format: string

    constructor(_chunkID: string,_chunkSize: number, _format: string) {
        this.ChunkID = _chunkID;
        this.ChunkSize = _chunkSize;
        this.Format = _format;
    }
}
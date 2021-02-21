import { RIFFChunk } from './riff-chunk';
import { FMTSubchunk } from './fmt-subchunk';
import { DATASubchunk } from './data-subchunk';

export class WAV{
    public RIFFChunk: RIFFChunk;
    public FMTSubchunk: FMTSubchunk;
    public DATASubchunk: DATASubchunk;

    constructor(_riffChunk: RIFFChunk, _fmtSubchunk: FMTSubchunk, _dataSubchunk: DATASubchunk) {
        this.RIFFChunk = _riffChunk;
        this.FMTSubchunk = _fmtSubchunk;
        this.DATASubchunk = _dataSubchunk;
    }
}
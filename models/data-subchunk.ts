import { Sample } from './sample';
export class DATASubchunk{
    Subchunk2ID: string;
    Subchunk2Size: number;
    Data: Sample[];

    constructor(_subchunk2Id: string, _subchunk2Size: number, _data: Sample[]) {
        this.Subchunk2ID = _subchunk2Id;
        this.Subchunk2Size = _subchunk2Size;
        this.Data = _data;
    }
}
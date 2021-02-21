export class FMTSubchunk{
    Subchunk1ID: string;
    Subchunk1Size: number;
    AudioFormat: number;
    NumChannels: number;
    SampleRate: number;
    ByteRate: number;
    BlockAlign: number;
    BitsPerSample: number;

    constructor(_subchunk1Id: string,
        _subchunk1Size: number,
        _audioFormat: number,
        _numChannels: number,
        _sampleRate: number,
        _byteRate: number,
        _blockAlign: number,
        _bitsPerSample: number) {
        this.Subchunk1ID = _subchunk1Id;
        this.Subchunk1Size = _subchunk1Size;
        this.AudioFormat = _audioFormat;
        this.NumChannels = _numChannels;
        this.SampleRate = _sampleRate;
        this.ByteRate = _byteRate;
        this.BlockAlign = _blockAlign;
        this.BitsPerSample = _bitsPerSample;
    }
}
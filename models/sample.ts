export class Sample {
    private _data: number[];
    numberOfChannels: number;

    constructor(_numberOfChannels: number) {
        this.numberOfChannels = _numberOfChannels;
        this._data = new Array<number>(_numberOfChannels);
    }
    
    public setData(sampleData: number[]) {
        if (sampleData.length !== this.numberOfChannels) {
            throw new Error("Wrong dimension");
        }
        this._data = sampleData;
    }

    public getData(): number[]{
        return this._data;
    }
}

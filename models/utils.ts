interface DataView {
    getUint24(pos: number, littleEndian: boolean): number;
    setUint24(pos: number, val: number, littleEndian: boolean): void;
}

//correct???
DataView.prototype.getUint24 = function (pos, littleEndian) {
    return this.getUint8(pos)+(this.getUint16(pos+1, littleEndian) << 8);
}

DataView.prototype.setUint24 = function (pos, val, littleEndian) {
    this.setUint8(pos, val & ~4294967040); // this "magic number" masks off the first 16 bits
    this.setUint16(pos + 1, val >> 8, littleEndian);
}
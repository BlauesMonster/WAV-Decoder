import { WAV } from './models/wav';
import { FMTSubchunk } from './models/fmt-subchunk';
import { DATASubchunk } from './models/data-subchunk';
import { RIFFChunk } from './models/riff-chunk';
import { Sample } from './models/sample';

export class WAVDecoder {

    decode(fileBuffer: Buffer) {
        let pos = fileBuffer.byteOffset;
        const end = fileBuffer.length;
        const buffer = fileBuffer.buffer;

        const view = new DataView(buffer);

        const chunkIdParts: string[] = [];
        for (let i = 0; i < 4; i++) {
            chunkIdParts.push(String.fromCharCode(view.getUint8(pos)));
            pos++;
        }
        const chunkId = chunkIdParts.join('');

        const chunkSize = view.getUint32(pos, true);
        pos += 4;

        const formatParts: string[] = [];
        for (let i = 0; i < 4; i++) {
            formatParts.push(String.fromCharCode(view.getUint8(pos)));
            pos++;
        }
        const format = formatParts.join('');

        if (chunkId !== "RIFF") {
            throw new Error("");

        }
        else if (format !== "WAVE") {
            throw new Error("");

        }
        const riffChunk = new RIFFChunk(chunkId, chunkSize, format);

        const subChunkId1Parts: string[] = [];
        for (let i = 0; i < 4; i++) {
            subChunkId1Parts.push(String.fromCharCode(view.getUint8(pos)));
            pos++;
        }
        const subChunkId1 = subChunkId1Parts.join('');

        const subChunk1Size = view.getUint32(pos, true);
        pos += 4;

        const subChunk1SizeMemory = pos;

        const audioFormat = view.getUint16(pos, true);
        pos += 2;

        const numChannels = view.getUint16(pos, true);
        pos += 2;

        const sampleRate = view.getUint32(pos, true);
        pos += 4;

        const byteRate = view.getUint32(pos, true);
        pos += 4;

        const blockAlign = view.getUint16(pos, true);
        pos += 2;

        const bitsPerSample = view.getUint16(pos, true);
        pos += 2;

        if (blockAlign !== (numChannels * bitsPerSample / 8)) {
            throw new Error("");
        }
        else if (byteRate !== (sampleRate * numChannels * bitsPerSample / 8)) {
            throw new Error("");

        }
        else if (subChunkId1 !== "fmt ") {
            throw new Error("");

        }

        const subchunk1Difference = Math.abs(subChunk1SizeMemory - pos);
        if (subchunk1Difference !== subChunk1Size) {
            throw new Error("");
        }

        if (audioFormat !== 1) {
            //extra params

            throw new Error("Not supported");
        }

        const fmtSubChunk = new FMTSubchunk(subChunkId1,
            subChunk1Size,
            audioFormat,
            numChannels,
            sampleRate,
            byteRate,
            blockAlign,
            bitsPerSample);

        const subChunkId2Parts: string[] = [];
        for (let i = 0; i < 4; i++) {
            subChunkId2Parts.push(String.fromCharCode(view.getUint8(pos)));
            pos++;
        }
        const subChunkId2 = subChunkId2Parts.join('');

        if (subChunkId2 !== "data") {
            throw new Error("");
        }

        const subChunk2Size = view.getUint32(pos, true);
        pos += 4;

        //const dataLength = (end - pos) /blockAlign;
        const amountOfSamples = subChunk2Size / blockAlign;
        const samples: Sample[] = new Array<Sample>(amountOfSamples);
        for (let i = 0; i < samples.length; i++) {
            const sample = new Sample(numChannels);
            const channelData: number[] = new Array<number>(numChannels);
            for (let j = 0; j < numChannels; j++) {
                switch (bitsPerSample) {
                    case 8:
                        const data8bit = view.getUint8(pos);
                        pos++;
                        channelData[j] = data8bit;
                        break;
                    case 16:
                        const data16bit = view.getUint16(pos, true);
                        pos += 2;
                        channelData[j] = data16bit;
                        break;
                    case 24:
                        const data24bit = view.getUint24(pos, true);
                        pos += 3;
                        channelData[j] = data24bit;
                        break;
                    case 32:
                        const data32bit = view.getUint32(pos, true);
                        pos += 4;
                        channelData[j] = data32bit;
                        break;
                    default:
                        throw new Error("");
                }
            }
            sample.setData(channelData);
            samples[i] = sample;
        }

        if (subChunk2Size !== (samples.length * numChannels * bitsPerSample / 8)) {
            throw new Error("");
        }

        const dataSubchunk = new DATASubchunk(subChunkId2, subChunk2Size, samples);

        if (chunkSize !== (4 + (8 + subChunk1Size) + (8 + subChunk2Size))) {
            throw new Error("");
        }

        const wav = new WAV(riffChunk, fmtSubChunk, dataSubchunk);

        return wav;
    }

    encode(wav: WAV): Buffer {
        let pos = 0;
        const arraybuf = new ArrayBuffer(8 + wav.RIFFChunk.ChunkSize);
        const view = new DataView(arraybuf);

        const chunkId: string = wav.RIFFChunk.ChunkID;
        for (let i = 0; i < 4; i++) {
            view.setUint8(pos, chunkId.charCodeAt(i));
            pos++;
        }

        view.setUint32(pos, wav.RIFFChunk.ChunkSize, true);
        pos += 4;

        const format: string = wav.RIFFChunk.Format;
        for (let i = 0; i < 4; i++) {
            view.setUint8(pos, format.charCodeAt(i));
            pos++;
        }

        const subChunkId1: string = wav.FMTSubchunk.Subchunk1ID;
        for (let i = 0; i < 4; i++) {
            view.setUint8(pos, subChunkId1.charCodeAt(i));
            pos++;
        }

        view.setUint32(pos, wav.FMTSubchunk.Subchunk1Size, true);
        pos += 4;

        view.setUint16(pos, wav.FMTSubchunk.AudioFormat, true);
        pos += 2;

        view.setUint16(pos, wav.FMTSubchunk.NumChannels, true);
        pos += 2;

        view.setUint32(pos, wav.FMTSubchunk.SampleRate, true);
        pos += 4;

        view.setUint32(pos, wav.FMTSubchunk.ByteRate, true);
        pos += 4;

        view.setUint16(pos, wav.FMTSubchunk.BlockAlign, true);
        pos += 2;

        view.setUint16(pos, wav.FMTSubchunk.BitsPerSample, true);
        pos += 2;

        const subChunkId2: string = wav.DATASubchunk.Subchunk2ID;
        for (let i = 0; i < 4; i++) {
            view.setUint8(pos, subChunkId2.charCodeAt(i));
            pos++;
        }

        view.setUint32(pos, wav.DATASubchunk.Subchunk2Size, true);
        pos += 4;

        const samples: Sample[] = wav.DATASubchunk.Data;
        for (let i = 0; i < samples.length; i++) {
            const sample = samples[i];
            for (let j = 0; j < wav.FMTSubchunk.NumChannels; j++) {
                switch (wav.FMTSubchunk.BitsPerSample) {
                    case 8:
                        view.setUint8(pos, sample.getData()[j]);
                        pos++;
                        break;
                    case 16:
                        view.setUint16(pos, sample.getData()[j], true);
                        pos += 2;
                        break;
                    case 24:
                        view.setUint24(pos, sample.getData()[j], true);
                        pos += 3;
                        break;
                    case 32:
                        view.setUint32(pos, sample.getData()[j], true);
                        pos += 4;
                        break;
                    default:
                        throw new Error("");
                }
            }
        }

        return Buffer.from(view.buffer);
    }

}
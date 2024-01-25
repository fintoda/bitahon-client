import {
  ChunkData,
  decodeChunks,
  decodeQRCodeChunk,
} from '@bitahon/transport';

type TState = {
  count: number;
  data: Array<ChunkData | null>;
};

export class ChanksDecoder {
  private chunksDone: Record<string, boolean>;
  private _state: TState;
  constructor() {
    this.chunksDone = {};
    this._state = {
      count: 0,
      data: [],
    };
  }

  decodeChunk(chunk: string) {
    try {
      if (this.chunksDone[chunk]) {
        return;
      }

      if (this.isDone()) {
        return;
      }
      const decodedChunk = decodeQRCodeChunk(chunk);

      if (
        !('chunkNumber' in decodedChunk) ||
        !('chunksCount' in decodedChunk)
      ) {
        return;
      }
      const num = decodedChunk.chunkNumber;
      const count = decodedChunk.chunksCount;

      if (count !== this._state.count) {
        this._state = {
          count,
          data: new Array(count).fill(null),
        };
      }
      this.chunksDone[chunk] = true;
      this._state.data[num] = decodedChunk;
      return true;
    } catch (err) {
      console.error(err);
    }
  }

  get chunks() {
    return this._state.data;
  }

  isDone() {
    if (!this._state.count) {
      return false;
    }
    return this._state.data.every((it) => it);
  }

  decodeChunks() {
    if (this.isDone()) {
      const chunks = this._state.data.filter((it) => it) as ChunkData[];
      return decodeChunks(chunks);
    }
    return null;
  }
}

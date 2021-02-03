import { hexToU8a, u8aToHex } from '@polkadot/util';
import { WebbNotePrefix, TokenSymbol, Scalar, Asset } from '@webb-tools/sdk-mixer';

export class Note {
  // Default constructor
  private constructor(
    public readonly prefix: WebbNotePrefix,
    public readonly version: string,
    public readonly tokenSymbol: TokenSymbol,
    public readonly id: number,
    // can be set later after the TX.
    public blockNumber: number | null,
    public readonly r: Scalar,
    public readonly nullifier: Scalar
  ) {}

  public static deserialize(value: string): Note {
    const parts = value.split('-');
    const withBlockNumber = parts.length === 6;
    let i = -1;
    const prefix = parts[++i] as WebbNotePrefix; // 0
    const version = parts[++i]; // 1
    const tokenSymbol = parts[++i] as TokenSymbol; // 2
    const id = parseInt(parts[++i]); // 3
    let blockNumber = null;
    if (withBlockNumber) {
      blockNumber = parseInt(parts[++i]); // 4?
    }
    const r = hexToU8a(parts[++i]); // 4-5
    const nullifier = hexToU8a(parts[++i]); // 5-6
    // assign values here after parsing it.
    return new Note(prefix, version, tokenSymbol, id, blockNumber, r, nullifier);
  }

  public serialize(): string {
    const parts: string[] = [];
    parts.push(this.prefix);
    parts.push(this.version);
    parts.push(this.tokenSymbol);
    parts.push(this.id.toString());
    if (this.blockNumber !== null) {
      parts.push(this.blockNumber.toString());
    }
    parts.push(u8aToHex(this.r, -1, false));
    parts.push(u8aToHex(this.nullifier, -1, false));

    const final = parts.join('-');
    return final;
  }

  public asAsset(): Asset {
    return new Asset(this.id, this.tokenSymbol);
  }
}
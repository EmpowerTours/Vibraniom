import { MusicUploaded } from "../generated/schema";

export function handleMusicUploaded(event: any): void {
  let entity = new MusicUploaded(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  entity.tokenId = event.params.tokenId;
  entity.title = event.params.title;
  entity.artistName = event.params.artistName;
  entity.coverImage = event.params.coverImage;
  entity.uri = event.params.uri;
  entity.price = event.params.price;
  entity.streamCount = 0;
  entity.artist = event.params.artist.toHexString();
  entity.save();
}

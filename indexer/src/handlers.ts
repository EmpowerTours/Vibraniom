import { MusicUploaded, Registered, MusicPurchased, MusicStreamed, MusicRated, MoodUpdated, SubscriptionRenewed } from "../generated/schema";

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

export function handleRegistered(event: any): void {
  let entity = new Registered(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  entity.user = event.params.user.toHexString();
  entity.userType = event.params.userType;
  entity.save();
}

export function handleMusicPurchased(event: any): void {
  let entity = new MusicPurchased(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  entity.tokenId = event.params.tokenId;
  entity.buyer = event.params.buyer.toHexString();
  entity.price = event.params.price;
  entity.save();
}

export function handleMusicStreamed(event: any): void {
  let entity = new MusicStreamed(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  entity.tokenId = event.params.tokenId;
  entity.user = event.params.user.toHexString();
  entity.save();
}

export function handleMusicRated(event: any): void {
  let entity = new MusicRated(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  entity.tokenId = event.params.tokenId;
  entity.user = event.params.user.toHexString();
  entity.emoji = event.params.emoji;
  entity.save();
}

export function handleMoodUpdated(event: any): void {
  let entity = new MoodUpdated(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  entity.user = event.params.user.toHexString();
  entity.moods = event.params.moods;
  entity.save();
}

export function handleSubscriptionRenewed(event: any): void {
  let entity = new SubscriptionRenewed(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  entity.user = event.params.user.toHexString();
  entity.newEnd = event.params.newEnd;
  entity.save();
}

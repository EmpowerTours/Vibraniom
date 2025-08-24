import { handleMusicUploaded, handleRegistered, handleMusicPurchased, handleMusicStreamed, handleMusicRated, handleMoodUpdated, handleSubscriptionRenewed } from "./handlers";

export const handlers = {
  MusicUploaded: handleMusicUploaded,
  Registered: handleRegistered,
  MusicPurchased: handleMusicPurchased,
  MusicStreamed: handleMusicStreamed,
  MusicRated: handleMusicRated,
  MoodUpdated: handleMoodUpdated,
  SubscriptionRenewed: handleSubscriptionRenewed
};

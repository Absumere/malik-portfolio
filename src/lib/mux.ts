import Mux from '@mux/mux-node';

const { Video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export interface MuxAsset {
  playbackId: string;
  assetId: string;
}

export async function createMuxUploadUrl(): Promise<{ url: string; assetId: string }> {
  try {
    const upload = await Video.Uploads.create({
      new_asset_settings: {
        playback_policy: ['public'],
        mp4_support: 'standard',
      },
      cors_origin: process.env.NEXT_PUBLIC_APP_URL,
    });

    return {
      url: upload.url,
      assetId: upload.asset_id as string,
    };
  } catch (error) {
    console.error('Error creating Mux upload:', error);
    throw new Error('Failed to create upload URL');
  }
}

export async function getMuxAsset(assetId: string): Promise<MuxAsset | null> {
  try {
    const asset = await Video.Assets.get(assetId);
    
    if (!asset || !asset.playback_ids?.[0]?.id) {
      return null;
    }

    return {
      playbackId: asset.playback_ids[0].id,
      assetId: asset.id,
    };
  } catch (error) {
    console.error('Error getting Mux asset:', error);
    return null;
  }
}

export async function deleteMuxAsset(assetId: string): Promise<void> {
  try {
    await Video.Assets.del(assetId);
  } catch (error) {
    console.error('Error deleting Mux asset:', error);
    throw new Error('Failed to delete video');
  }
}

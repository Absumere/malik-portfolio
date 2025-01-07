import { api } from '../convex/_generated/api';
import { ConvexClient } from 'convex/browser';

async function addEmergenzProject() {
  const client = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  try {
    const result = await client.mutation(api.portfolio.create, {
      title: "Emergenz",
      description: "An experimental art project exploring emergence through generative AI",
      imageUrl: "/placeholder-image.jpg", // Fallback image
      playbackId: "Ero9YiIIxKe011Um4vOAHFb02Dix6gKe00oyaE2QIr7FRM",
      tags: ["AI", "Art", "Generative", "Experimental"],
      category: "featured"
    });

    console.log('Successfully added Emergenz project:', result);
  } catch (error) {
    console.error('Failed to add Emergenz project:', error);
  }
}

addEmergenzProject();

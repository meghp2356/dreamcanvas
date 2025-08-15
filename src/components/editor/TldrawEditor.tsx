import { createTLStore, inlineBase64AssetStore, Tldraw } from "tldraw";
import { useSync } from "@tldraw/sync";
import "tldraw/tldraw.css";
import { useUser } from "@clerk/nextjs";

export default function TldrawEditor({ roomId  }: { roomId : string }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>; // or a spinner
  }

  console.log("room:", roomId);

  const uri = `wss://my-app.meghp7676.workers.dev/ws?roomId=${encodeURIComponent(roomId)}&sessionid=${encodeURIComponent(user!.id)}`;

  const store = useSync({
    uri, // or your DO route
    assets: inlineBase64AssetStore,
    userInfo : {
      id : user!.id,
      name : user!.username
    }
  });


  return (
    <div className="w-full h-[60vh] md:h-[calc(100vh-1rem)] border-2 border-gray-700 rounded-3xl overflow-hidden bg-neutral-900 shadow-inner">
      <Tldraw
        // snapshot={snapShot}
        store={store}
      />
    </div>
  );
}

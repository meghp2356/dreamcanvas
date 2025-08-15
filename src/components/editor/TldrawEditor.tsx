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
    <div className="w-screen h-screen border-2 border-gray-700 rounded-none overflow-hidden bg-neutral-900">
  <Tldraw store={store} />
</div>

  );
}

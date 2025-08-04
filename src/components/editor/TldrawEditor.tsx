import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

export default function TldrawEditor({snapShot=""}:{snapShot? : any}) {
  return (
    <div className="w-full h-[60vh] md:h-[calc(100vh-1rem)] border-2 border-gray-700 rounded-3xl overflow-hidden bg-neutral-900 shadow-inner">
      <Tldraw 
        snapshot={snapShot}
      />
    </div>
  );
}

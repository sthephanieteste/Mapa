import { useEffect, useRef } from "react";
import { musicControls } from "@/hooks/useMusicPlayer";

export default function MusicPlayer() {
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    return musicControls.init();
  }, []);

  return null;
}

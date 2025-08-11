import { useEffect, useState } from "react";
import Spinner from "./Spinner";

interface LoaderProps {
  loaded: boolean;
}

const BASE_DELAY = 600;

export default function Loader({ loaded }: LoaderProps) {
  const [delay, setDelay] = useState<number>(BASE_DELAY);
  const [startTime, _] = useState<number>((new Date()).getTime());

  useEffect(() => {
    if (loaded) {
      const currentTime = new Date();
      const elapsedTime = currentTime.getTime() - startTime;
      setDelay(Math.max(0, BASE_DELAY - elapsedTime));
    }
  }, [loaded]);

  return (
    <div className={`duration-1000 fixed inset-0 background z-[100] flex flex-col justify-center items-center p-10 ${loaded && "opacity-0 pointer-events-none"}`} style={{ transitionDelay: (delay + 600) + "ms" }}>
      <div className={`flex flex-col justify-center items-center gap-6 opacity-1 duration-500 ${loaded && "opacity-0"}`} style={{ transitionDelay: delay + "ms" }}>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif italic">
          Chris Elliott Art Gallery
        </h1>
        <Spinner />
      </div>
    </div>
  )
}
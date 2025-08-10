import { useEffect, useState } from "react";
import Spinner from "./Spinner";

interface LoaderProps {
  loaded: boolean;
}

const BASE_DELAY = 700;

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
    <div className={`duration-700 ${loaded && "opacity-0 pointer-events-none"} fixed inset-0 background z-[100] flex flex-col justify-center items-center p-10`} style={{ transitionDelay: delay + "ms" }}>
      <div className="fade-in flex flex-col justify-center items-center gap-6">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif italic">
          Chris Elliott Art Gallery
        </h1>
        <Spinner />
      </div>
    </div>
  )
}
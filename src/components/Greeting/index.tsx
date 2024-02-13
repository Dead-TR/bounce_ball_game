import { FC, useEffect, useRef, useState } from "react";
import clsx from "clsx";

import { gratitude } from "./config";
import css from "./style.module.css";

interface Props {
  onComplete: () => void;
}

const GreetingComponent: FC<Props> = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const wrapper = useRef<HTMLDivElement>(null);

  const img = gratitude[index];

  useEffect(() => {
    if (index < gratitude.length) return;

    onComplete();
  }, [index]);

  if (index >= gratitude.length) return null;
  return (
    <div ref={wrapper} className={css.root}>
      <img
        src={img}
        alt="logo"
        className={clsx(css.img, css.animate)}
        onAnimationEnd={(e) => {
          const imgElement = e.target as HTMLImageElement;

          imgElement.classList.remove(css.animate);
          setTimeout(() => {
            setIndex((old) => old + 1);

            setTimeout(() => {
              imgElement.classList.add(css.animate);
            }, 0);
          }, 100);
        }}
      />
    </div>
  );
};

export const Greeting = () => {
  const [isComplete, setIsComplete] = useState(false);

  if (isComplete) return null;
  return <GreetingComponent onComplete={() => setIsComplete(true)} />;
};

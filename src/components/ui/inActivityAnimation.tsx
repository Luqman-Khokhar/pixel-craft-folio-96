import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import animationData from "@/assets/animations/sleepingCat.json";

export const InactivityAnimation = () => {
  const [isInactive, setIsInactive] = useState(false);
  let timeoutId: any;

  const resetTimer = () => {
    clearTimeout(timeoutId);
    setIsInactive(false);
    timeoutId = setTimeout(() => setIsInactive(true), 5000); // inactivity time yahan sy set krna he
  };

  useEffect(() => {
    // Start inactivity timer
    timeoutId = setTimeout(() => setIsInactive(true), 10000);

    // Reset timer on any user action
    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, []);

  return (
    <div className="fixed top-6 left-6 z-50">
      {isInactive && (
        <Lottie
          animationData={animationData}
          loop={true}
          style={{ width: 200, height: 200 }}
        />
      )}
    </div>
  );
};

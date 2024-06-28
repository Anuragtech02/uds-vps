"use client";
import { FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ReactLenis } from "@studio-freight/react-lenis";

interface AppwrapperProps {
  children: React.ReactNode;
}

export const variants = {
  out: {
    opacity: 0,
    transition: {
      duration: 0.333,
    },
  },
  in: {
    opacity: 1,
    scale: 1,

    transition: {
      duration: 0.2,
      delay: 0.05,
    },
  },
};

const Appwrapper: FC<AppwrapperProps> = ({ children }) => {
  return (
    <ReactLenis root>
      <AnimatePresence mode="wait">
        <motion.main
          key="main"
          variants={variants}
          animate="in"
          initial="out"
          exit="out"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </ReactLenis>
  );
};

export default Appwrapper;

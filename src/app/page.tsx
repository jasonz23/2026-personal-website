"use client";

import GridLayout from "@/components/layout/GridLayout";
import LoadingSequence from "@/components/effects/LoadingSequence";
import { usePanels } from "@/hooks/usePanels";

export default function Home() {
  const { revealPanels } = usePanels();

  return (
    <>
      <LoadingSequence onComplete={revealPanels} />
      <GridLayout />
    </>
  );
}

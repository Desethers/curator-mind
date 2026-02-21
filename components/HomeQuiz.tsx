"use client";

import { useState } from "react";
import { DoubleBar } from "./DoubleBar";

export function HomeQuiz() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  return (
    <DoubleBar
      currentStep={currentStep}
      onStepChange={setCurrentStep}
    />
  );
}

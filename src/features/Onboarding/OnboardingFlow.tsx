// OnboardingFlow.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { onboardingSteps } from "./data/OnboardingData.ts";
import OnboardingLayout from "./OnboardingLayout";

export default function OnboardingFlow() {
    const [step, setStep] = useState(0);
    const navigate = useNavigate();

    const isLast = step === onboardingSteps.length - 1;

    const handleNext = () => {
        if (isLast) {
            // localStorage.setItem("hasSeenOnboarding", "true");
            navigate("/create-account");
        } else {
            setStep((prev) => prev + 1);
        }
    };

    const handleSkip = () => {
        // localStorage.setItem("hasSeenOnboarding", "true");
        navigate("/create-account");
    };

    return (
        <OnboardingLayout
            step={step}
            total={onboardingSteps.length}
            data={onboardingSteps[step]}
            onNext={handleNext}
            onSkip={handleSkip}
            isLast={isLast}
        />
    );
}
import {useEffect, useState} from "react";

interface PropsInterface {
    value: number,
    steps: string[],
}

export default function ArcProgressStep({value, steps}: PropsInterface) {
    const [activeStepIndex, SetActiveStepIndex] = useState<number>(0)

    // watch value
    useEffect(() => {
        SetActiveStepIndex(value)
    }, [value]);

    return (
        <ul className="arc-progress-step">
            {steps.map((item, index) => (
                <li key={index}
                    className={[
                    (index < activeStepIndex) && 'progress-pass',
                    (index === activeStepIndex) && 'progress-active',
                ].join(' ')}
                >{item}</li>
            ))}
        </ul>
    )
}

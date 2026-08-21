interface ArcProgressStepPropsInterface {
    value: number;
    steps: string[];
}

export default function ArcProgressStep({ value, steps }: ArcProgressStepPropsInterface) {
    return (
        <ul className="arc-progress-step">
            {steps.map((item, index) => (
                <li
                    key={index}
                    className={[
                        index < value ? 'progress-pass' : '',
                        index === value ? 'progress-active' : '',
                    ].filter(Boolean).join(' ')}
                >
                    {item}
                </li>
            ))}
        </ul>
    );
}

import * as React from "react";
import { useEffect, useRef, useState } from "react";

//==================================================| Types
interface CountdownValueInterface {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
}
interface ArcCountdownTimerProps {
    until: number | string;/** 120 (ثانیه) یا '2025-01-01 00:00:00' (تاریخ هدف) */
    type: string;/** d:h:m:s | h:m:s | m:s | s */
    onEnded?: () => void;
}

const ZERO_COUNTDOWN: CountdownValueInterface = { days: '00', hours: '00', minutes: '00', seconds: '00' };
const TYPE_PATTERN = /^[dhms](?::[dhms])*$/;

/**
 * @example
 * <ArcCountdownTimer until={120} type="m:s" onEnded={() => console.log('تمام شد')} />
 * <ArcCountdownTimer until="2025-01-01 00:00:00" type="d:h:m:s" />
 */
export default function ArcCountdownTimer({ until, type, onEnded }: ArcCountdownTimerProps) {
    const [countdown, setCountdown] = useState<CountdownValueInterface>({ days: '', hours: '', minutes: '', seconds: '' });
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const onEndedRef = useRef(onEnded);
    onEndedRef.current = onEnded;

    useEffect(() => {
        if (!TYPE_PATTERN.test(type)) {
            console.error(`ArcCountdownTimer: invalid type: ${type}`);
            return;
        }

        let end: number;
        if (isNaN(Number(until))) { // '2025-01-01 00:00:00'
            const date = new Date(until);
            if (isNaN(date.getTime())) {
                console.error(`ArcCountdownTimer: invalid date: ${until}`);
                return;
            }
            end = date.getTime();
        } else { //  120s
            end = new Date().getTime() + Number(until) * 1000;
        }

        const updateCountdown = () => {
            const difference = end - new Date().getTime();

            if (difference < 0) {
                setCountdown(ZERO_COUNTDOWN);
                onEndedRef.current?.();
                if (intervalRef.current) clearInterval(intervalRef.current);
                return;
            }

            setCountdown({
                days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0'),
                hours: String(Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0'),
                minutes: String(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0'),
                seconds: String(Math.floor((difference % (1000 * 60)) / 1000)).padStart(2, '0'),
            });
        };

        if (end - new Date().getTime() > 0) { // still valid
            updateCountdown();
            intervalRef.current = setInterval(updateCountdown, 1000);
        } else { // passed time
            setCountdown(ZERO_COUNTDOWN);
            onEndedRef.current?.();
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [until, type]);

    return (
        <ul className="arc-countdown-timer">
            {type.includes('d') && <li>{countdown.days}</li>}
            {type.includes('h') && <li>{countdown.hours}</li>}
            {type.includes('m') && <li>{countdown.minutes}</li>}
            {type.includes('s') && <li>{countdown.seconds}</li>}
        </ul>
    );
}

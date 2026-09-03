import * as React from "react";
import useSlide from "@/shared/hooks/useSlide";
import { useRef, useState } from "react";

interface ArcFaqPropsInterface {
    list_faq: [string, string][];
}

export default function ArcFaq({ list_faq }: ArcFaqPropsInterface) {
    const { slideToggle } = useSlide();
    const answerRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());

    const onClickQuestion = (index: number) => {
        const isCurrentlyOpen = openIndexes.has(index);
        // animation
        slideToggle(answerRefs.current[index], {
            duration: 350,
            easing: "ease-out",
        });
        // update state
        setOpenIndexes((prev) => {
            const next = new Set(prev);
            if (isCurrentlyOpen) {
                next.delete(index);
            } else {
                next.add(index);
            }
            return next;
        });
    };

    return (
        <div className="arc-faq">
            <ul>
                {list_faq.map((item, index) => (
                    <li key={index}>
                        <div className="faq-question" onClick={() => onClickQuestion(index)}>
                            <p>{item[0]}</p>
                            <i className={`fa-regular ${openIndexes.has(index) ? "fa-chevron-up" : "fa-chevron-down"}`}/>
                        </div>
                        <div
                            className="faq-answer"
                            ref={(el) => {answerRefs.current[index] = el}}
                            style={{ display: "none" }}
                        >
                            <p>{item[1]}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

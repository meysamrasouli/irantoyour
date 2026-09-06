import { useState } from "react";

interface ArcFaqPropsInterface {
    list_faq: [string, string][];
}

export default function ArcFaq({ list_faq }: ArcFaqPropsInterface) {
    const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());

    const onClickQuestion = (index: number) => {
        setOpenIndexes((prev) => {
            const next = new Set(prev);
            if (next.has(index)) {
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
                {list_faq.map((item, index) => {
                    const isOpen = openIndexes.has(index);

                    return (
                        <li key={index}>
                            <div className="faq-question" onClick={() => onClickQuestion(index)} aria-expanded={isOpen}>
                                <p>{item[0]}</p>
                                <i className={`fa-regular ${isOpen ? "fa-chevron-up" : "fa-chevron-down"}`}/>
                            </div>
                            <div className={`faq-answer ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
                                <div className="faq-answer-body">
                                    <p>{item[1]}</p>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

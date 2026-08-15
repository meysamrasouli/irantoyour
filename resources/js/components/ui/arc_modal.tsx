import * as React from "react";
import { useEffect } from "react";

//==================================================| Types
type ModalIconType = 'logo' | 'success' | 'warning' | 'error' | 'exclamation';

const modalIconSrcMap: Record<ModalIconType, string> = {
    logo: '/images/logo/logo.svg',
    success: '/images/icons/modal/success.svg',
    warning: '/images/icons/modal/warning.svg',
    error: '/images/icons/modal/error.svg',
    exclamation: '/images/icons/modal/exclamation.svg',
};

interface ArcModalButtonInterface {
    text: string;
    className?: string;
    onClick?: () => void;
}
interface ArcModalPropsInterface {
    open: boolean;
    setOpen?: (open: boolean) => void;
    header?: string;
    icon?: ModalIconType;
    title?: string;
    text?: string;
    buttons?: ArcModalButtonInterface[];
    buttonClose?: boolean;
    closeOnBackdropClick?: boolean;
    children?: React.ReactNode;
}

/**
 * @example
 * const [isOpen, setIsOpen] = useState(false)
 * <ArcModal open={isOpen} setOpen={setIsOpen} header="انتخاب آدرس">...</ArcModal>
 */
export default function ArcModal({
                                     open,
                                     setOpen,
                                     header,
                                     icon,
                                     title,
                                     text,
                                     buttons,
                                     buttonClose = true,
                                     closeOnBackdropClick = true,
                                     children,
                                 }: ArcModalPropsInterface) {
    const close = () => setOpen?.(false);

    if (!open) return null;

    const showFooter = (buttons && buttons.length > 0) || buttonClose;

    return (
        <div className="overlay"
             onClick={(e) => {
                 if (closeOnBackdropClick && e.target === e.currentTarget) close();
             }}
        >
            <div className="arc-modal modal">
                <div className="modal-header">
                    <i onClick={close} className="close-icon fa fa-times" />
                    {header && <span>{header}</span>}
                </div>

                {icon && (
                    <div className="modal-icon">
                        <img src={modalIconSrcMap[icon]} alt="" />
                    </div>
                )}

                {title && <div className="modal-title">{title}</div>}

                {text && <div className="modal-text">{text}</div>}

                {children && <div className="modal-body">{children}</div>}

                {showFooter && (
                    <div className="modal-footer button-container">
                        {buttons?.map((button, index) => (
                            <button
                                key={index}
                                type="button"
                                className={button.className}
                                onClick={button.onClick}
                            >
                                {button.text}
                            </button>
                        ))}
                        {buttonClose && <button className="custom-button-trans-primary" onClick={close}>بستن</button>}
                    </div>
                )}
            </div>
        </div>
    );
}

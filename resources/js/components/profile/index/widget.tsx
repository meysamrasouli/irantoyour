import * as React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

export interface WidgetItemInterface {
    icon: string;
    value: string;
    title: string;
}

interface WidgetProps {
    items: WidgetItemInterface[];
    autoplayDelay?: number; // ms
    staticBreakpoint?: number; // از این عرض (px) به بالا، دیگه carousel نیست و آیتم‌ها کنار هم ثابت می‌مونن
    maxVisibleItems?: number; // بیشترین تعداد آیتمی که در بزرگ‌ترین حالت هم‌زمان دیده می‌شه
}

/**
 * @example
 * <Widget
 *     items={[
 *         { icon: 'fa-shield-check', value: '۴۵ روز', title: 'اشتراک من' },
 *         { icon: 'fa-wallet', value: '۲,۴۵۰,۰۰۰ تومان', title: 'کیف پول' },
 *     ]}
 * />
 */
export default function Widget({
                                    items,
                                    autoplayDelay = 4000,
                                    staticBreakpoint = 768,
                                    maxVisibleItems = 4,
                                }: WidgetProps) {
    if (items.length === 0) return null;

    const visibleAtStatic = Math.min(items.length, maxVisibleItems);
    const overflowsAtStatic = items.length > maxVisibleItems;

    return (
        <Swiper
            className="widget-container"
            modules={[Autoplay]}
            dir="rtl"
            spaceBetween={10}
            slidesPerView={'auto'}
            loop={items.length > 1}
            autoplay={items.length > 1 ? { delay: autoplayDelay, disableOnInteraction: false } : false}
            breakpoints={{
                [staticBreakpoint]: {
                    slidesPerView: visibleAtStatic,
                    spaceBetween: 16,
                    loop: false,
                    autoplay: false,
                    // اگه بیشتر از maxVisibleItems آیتم داشته باشیم، حتی توی صفحه‌ی بزرگ هم
                    // باید بشه با کشیدن، بقیه‌ی آیتم‌ها رو دید — فقط وقتی همه جا می‌شن غیرفعاله
                    allowTouchMove: overflowsAtStatic,
                },
            }}
        >
            {items.map((item, index) => (
                <SwiperSlide key={index}>
                    <i className={`fa-regular ${item.icon}`}></i>
                    <span>{item.value}</span>
                    <div>{item.title}</div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

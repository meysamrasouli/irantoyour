import React, {useState, useEffect, useRef, useCallback} from 'react';
import {useClickOutside} from "@/shared/hooks/useClickOutside";

//==================================================| Types
/**
 * # options
 *  {
 *      object => {1: 'abc', 2: 'def', ...}
 *      array => [0, 4, 7, 12, 18]
 *      array object => [{id:12,name:'john',mobile:'123'},{id:13,name:'Sara',mobile:456},...]
 *  }
 *
 *  # option_properties
 *      {
 *          {type: 'object'} => (options should be treated as object | value: object.key - text: object. Value)
 *          {type: 'array'} => (options should be treated as array | value: array. Item - text: array.Item)
 *          {type: 'array_object', value:'id',text:'province_name'} => (options should treat as Array of Objects | value: custom - text: custom)
 *      }
 *      extra is optional => {type: 'object', extra: {value: '', text: '', title: ''}}
 * */
interface ArcSelectProps {
    value?: any; // modelValue
    setValue?: (value: any) => void; // update:modelValue
    onChange?: (value: any) => void; // onchange
    options: Record<string, any> | any[];
    option_properties: OptionPropertiesType;
    option_reverse?: boolean;// reverse the order of options
    selected?: Record<string, any>;// selected option
    output?: OutputType;// what should return as an output ('value'|'text'|'index'|'full')
    dropdown_type?: DropdownType;// dropdown should be open all the time or closed
    dropdown_select?: DropdownSelect;// single output or array of outputs
    dropdown_search?: boolean;// allow search
    placeholder?: string;// input placeholder
    required?: boolean;// required attribute
}

export type OptionPropertiesType =
    | { type: 'object'; append?: { value?: string; text?: string; title?: string } }// object => {book: 'BOOK', window: 'WINDOW', ...}
    | { type: 'array'; append?: { value?: string; text?: string; title?: string } }// array => [0, 4, 7, 12, 18]
    | { type: 'array_object'; value: string; text: string; append?: { value?: string; text?: string; title?: string } };// array object => [{id:12,name:'john',mobile:'123'},{id:13,name:'sara',mobile:456},...]
interface ComponentOptionInterface {
    value: string | number;
    text: string;
    title?: string | null;
}
interface IndexValueTextInterface {
    index: number;
    value: string | number;
    text: string;
}
type OutputType = 'value' | 'text' | 'index' | 'full';
type DropdownType = 'open' | 'close';
type DropdownSelect = 'single' | 'multiple';
//==================================================| Helpers
/**
 * @function componentOptionMaker - making component_option from options & option_properties
 * */
function componentOptionMaker(
    options: Record<string, any> | any[],
    option_properties: OptionPropertiesType,
    option_reverse: boolean
): ComponentOptionInterface[] {

    const result: ComponentOptionInterface[] = [];
    let value: any, text: any;

    const appendValue: string | null = option_properties?.append?.value ?? null;
    const appendText: string | null = option_properties?.append?.text ?? null;
    const appendTitle: string | null = option_properties?.append?.title ?? null;

    //------------------------------| component options maker
    switch (option_properties.type) {
        case 'object':
            for (const index in options) {
                // append
                value = appendValue ? `${index} ${appendValue}` : index;
                text = appendText ? `${(options as Record<string, any>)[index]} ${appendText}` : (options as Record<string, any>)[index];

                result.push({
                    value: !isNaN(value) && value !== '' ? parseInt(value) : String(value),
                    text: String(text),
                    title: appendTitle,
                });
            }
            break;

        case 'array':
            (options as any[]).forEach((item: any, index: number) => {
                // append
                value = appendValue ? `${item} ${appendValue}` : item;
                text = appendText ? `${(options as any[])[index]} ${appendText}` : (options as any[])[index];

                result.push({
                    value: !isNaN(value) && value !== '' ? parseInt(value) : String(value),
                    text: String(text),
                    title: appendTitle,
                });
            });
            break;

        case 'array_object': {
            const valField = option_properties.value;
            const textField = option_properties.text;

            (options as any[]).forEach((option) => {
                // append
                value = appendValue ? `${option[valField]} ${appendValue}` : option[valField];
                text = appendText ? `${option[textField]} ${appendText}` : option[textField];

                result.push({
                    value: !isNaN(value) && value !== '' ? parseInt(value) : String(value),
                    text: String(text),
                    title: appendTitle,
                });
            });
            break;
        }
    }

    //------------------------------| reverse the options order
    if (option_reverse) result.reverse();

    return result;
}
/**
 * @function outputValueMaker - define the component output
 * */
function outputValueMaker(
    outputObject: IndexValueTextInterface,
    outputType: OutputType,
    dropdown_select: DropdownSelect
): any {

    if (!outputObject)
        return dropdown_select === 'multiple' ? [] : '';

    switch (outputType) {
        case 'full':
            return outputObject;
        case 'index':
        case 'text':
        case 'value':
            if (dropdown_select === 'multiple') {
                // multiple (array-object)
                return Array.isArray(outputObject)
                    ? outputObject.map((item: IndexValueTextInterface) => item[outputType])
                    : [];
            }else{
                // single (object)
                return outputObject[outputType] ?? '';
            }
    }
}

//==================================================| Component
export default function ArcSelect({
                                      value,
                                      setValue,
                                      onChange,
                                      options,
                                      option_properties,
                                      option_reverse = false,
                                      selected,
                                      output = 'value',
                                      dropdown_type = 'close',
                                      dropdown_select = 'single',
                                      dropdown_search = false,
                                      placeholder = '',
                                      required = false,
                                  }: ArcSelectProps) {

    const [outputValueObj, setOutputValueObj] = useState<any>(null);
    const [componentOptions, setComponentOptions] = useState<ComponentOptionInterface[]>([]);
    const [filteredOption, setFilteredOption] = useState<ComponentOptionInterface[]>([]);
    const [selectedFilteredOptionIndex, setSelectedFilteredOptionIndex] = useState<number | undefined>(undefined);
    const [slideState, setSlideState] = useState<boolean>(dropdown_type === 'open');
    const [inputValue, setInputValue] = useState<string>('');

    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const ulRef = useRef<HTMLUListElement>(null);

    //==================================================| Function
    /**
     * @function slideToggle - slider state
     * */
    const slideToggle = (status: boolean) => (dropdown_type === 'open' ? true : status);

    /**
     * @function filterOption - filter componentOptions base on search text
     * */
    const filterOption = (search_text: string, componentOption: ComponentOptionInterface[] = componentOptions) => {
        setFilteredOption(
            componentOption.filter((option) =>
                (search_text !== '')
                    ? option.text.toLowerCase().indexOf(search_text.toLowerCase()) > -1
                    : option.value !== '' && option.value !== null
            )
        );
    };

    const outputStage = (
        indexValueText: IndexValueTextInterface,
        onEmitModelValue: boolean,
        onEmitChange: boolean
    ) => {
        let newObj: any;
        if (dropdown_select === 'multiple') {
            const current: IndexValueTextInterface[] = Array.isArray(outputValueObj) ? outputValueObj : [];
            const foundDuplication = current.find((item) => item.value === indexValueText.value && item.text === indexValueText.text);

            newObj = (foundDuplication)
                ? current.filter((item) => !(item.value === indexValueText.value && item.text === indexValueText.text))// remove duplicated item in multiple type (toggle)
                : [...current, indexValueText];// add only unique item in multiple type
        } else {// single (object)
            newObj = indexValueText;
        }

        //------------------------------| action before returning value
        setOutputValueObj(newObj);
        setSelectedFilteredOptionIndex(undefined);// highlight selected li
        setInputValue(dropdown_select === 'multiple' ? '' : (newObj as IndexValueTextInterface).text);// change input text to selected option
        setSlideState(slideToggle(false));// slideUp

        //------------------------------| returning value
        const newOutputValue = outputValueMaker(newObj, output, dropdown_select);
        const isEqual = (dropdown_select === 'multiple' || output === 'full')
            ? JSON.stringify(newOutputValue) === JSON.stringify(value)
            : newOutputValue === value;

        if (onEmitModelValue && !isEqual) setValue?.(newOutputValue);
        if (onEmitChange) onChange?.(newOutputValue);
    };

    /**
     * @function outputValueObjMaker - make {Index Value Text} OR [{Index Value Text}] from selectedValue parameter which passed by componentValue or ComponentSelected
     * */
    const outputValueObjMaker = (selectedValue: any, componentOptions: ComponentOptionInterface[]) => {
        //let componentValue: any | null;

        if (dropdown_select === 'multiple') {
            let componentValue: IndexValueTextInterface[] = []

            Object.values(selectedValue ?? {}).forEach((itemValue: any) => {
                switch (output) {
                    case 'full':
                        componentOptions.forEach((item, index) => {
                            if (JSON.stringify(item) === JSON.stringify(itemValue)) componentValue.push({ index, value: item.value, text: item.text });
                        });
                        break;
                    case 'index':
                        componentOptions.forEach((item, index) => {
                            if (index === parseInt(itemValue)) componentValue.push({ index, value: item.value, text: item.text });
                        });
                        break;
                    case 'text':
                    case 'value': {
                        const normalized = !isNaN(itemValue) && itemValue !== '' ? parseInt(itemValue) : String(itemValue);
                        componentOptions.forEach((item, index) => {
                            if (item[output] === normalized) componentValue.push({ index, value: item.value, text: item.text });
                        });
                        break;
                    }
                }
            });

            if (componentValue.length > 0)
                setOutputValueObj(componentValue)
                //outputStage(componentValue, true, false);
        } else {
            let componentValue: IndexValueTextInterface | null = null

            switch (output) {
                case 'full':
                    componentOptions.forEach((item, index) => {
                        if (JSON.stringify(item) === JSON.stringify(selectedValue)) componentValue = { index, value: item.value, text: item.text };
                    });
                    break;
                case 'index':
                    componentOptions.forEach((item, index) => {
                        if (index === parseInt(selectedValue)) componentValue = { index, value: item.value, text: item.text };
                    });
                    break;
                case 'text':
                case 'value':
                    componentOptions.forEach((item, index) => {
                        if (item[output] === selectedValue) componentValue = { index, value: item.value, text: item.text };
                    });
                    break;
            }

            if (componentValue !== null)
                setOutputValueObj(componentValue)
                //outputStage(componentValue, true, false);
        }
    };

    //==================================================| Effect
    /**
     *  initiate (created + watch options)
     * */
    useEffect(() => {
        const newOptions = componentOptionMaker(options, option_properties, option_reverse);

        setOutputValueObj(dropdown_select === 'multiple' ? [] : {});
        setComponentOptions(newOptions);
        filterOption('', newOptions);

        // check component value
        const hasValue =
            value === 0 ||
            (typeof value === 'string' && value !== '') ||
            (typeof value === 'number' && !isNaN(value)) ||
            (Array.isArray(value) && value.length > 0) ||
            (value !== null && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length > 0);

        if (selected !== undefined) {
            outputValueObjMaker(selected, newOptions);
        } else if (hasValue) {
            outputValueObjMaker(value, newOptions);
        } else {
            setComponentOptions([{ value: '', text: '' }, ...newOptions]);// empty option
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options, option_properties, option_reverse]);

    //==================================================| Effect - watch
    /**
     * watch selected
     * */
    const isFirstSelectedRender = useRef(true);
    useEffect(() => {
        if (isFirstSelectedRender.current) {
            isFirstSelectedRender.current = false;
            return;
        }
        if (selected !== undefined)
            outputValueObjMaker(selected, componentOptions);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected]);

    /**
     * watch value
     * */
    const isFirstValueRender = useRef(true);
    useEffect(() => {
        if (isFirstValueRender.current) {
            isFirstValueRender.current = false;
            return;
        }
        const currentOutput = outputValueMaker(outputValueObj, output, dropdown_select);
        const changed =
            dropdown_select === 'multiple' || output === 'full'
                ? JSON.stringify(value) !== JSON.stringify(currentOutput)
                : value !== currentOutput;

        if (changed) outputValueObjMaker(value, componentOptions);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    //==================================================| Events
    /**
     * @event onClick input
     * */
    const onClickInput = () => {
        setSlideState(slideToggle(!slideState));
        inputRef.current?.select();
    };

    /**
     * @event onClick outside
     * */
    useClickOutside(wrapperRef,
        useCallback(() => {
            setSlideState(slideToggle(false));
            if (dropdown_select === 'multiple') {
                setInputValue('');
            } else {
                setInputValue(outputValueObj?.text ?? '');
            }
        }, [outputValueObj, dropdown_select, dropdown_type])
    );

    /**
     * @event onKeyUp input
     * */
    const onKeyUpInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!dropdown_search) return;

        setSlideState(slideToggle(true));
        const liHeight = ulRef.current?.children[0]?.clientHeight || 33;

        switch (e.key) {
            case 'Enter': {
                if (inputValue !== '' && filteredOption.length !== 0) {// search text must be filled and at least one option must be in the list
                    // if there is only one item in the list, set index to 0 if not, pick the first item
                    const liIndex = filteredOption.length === 1 || (selectedFilteredOptionIndex === undefined) ? 0 : selectedFilteredOptionIndex;

                    componentOptions.forEach((option, index) => {
                        if (option.value === filteredOption[liIndex].value && option.text === filteredOption[liIndex].text) {
                            outputStage({
                                index: index,
                                value: filteredOption[liIndex].value,
                                text: filteredOption[liIndex].text
                            }, true, true);
                        }
                    });

                    setSelectedFilteredOptionIndex(undefined);
                    filterOption('');
                }
                break;
            }

            case 'ArrowUp': {
                let newIndex = (selectedFilteredOptionIndex !== undefined) ? selectedFilteredOptionIndex : 0;
                newIndex = (filteredOption.length === 1)
                    ? 0 // there is only one item in the list, bring highlight to top
                    : ((newIndex === 0) ? filteredOption.length - 1 : newIndex - 1);// choose above item

                setSelectedFilteredOptionIndex(newIndex);
                if (ulRef.current) ulRef.current.scrollTop = newIndex * liHeight;// scroll to the selected item - (if is for preventing NULL)
                if (filteredOption[newIndex]) setInputValue(filteredOption[newIndex].text);// change input text
                break;
            }

            case 'ArrowDown': {
                let newIndex = (selectedFilteredOptionIndex !== undefined) ? selectedFilteredOptionIndex : -1;
                newIndex = (filteredOption.length === 1)
                    ? 0 // there is only one item in the list, bring highlight to top
                    : ((newIndex === filteredOption.length - 1) ? 0 : newIndex + 1);// choose below item

                setSelectedFilteredOptionIndex(newIndex);
                if (ulRef.current) ulRef.current.scrollTop = newIndex * liHeight;// scroll to the selected item - (if is for preventing NULL)
                if (filteredOption[newIndex]) setInputValue(filteredOption[newIndex].text);// change input text
                break;
            }

            case 'Escape':
                setSlideState(slideToggle(false));
                inputRef.current?.blur();
                break;

            default:
                setSelectedFilteredOptionIndex(0);// after every keypress bring highlight item to the top
                filterOption(inputValue);// filter list base on input text
        }
    };

    /**
     * @event onClick li options
     * */
    const onClickLi = (item: IndexValueTextInterface) => outputStage(item, true, true);

    /**
     * @event onClick li multiple icon
     * */
    const onClickLiMultiple = (item: IndexValueTextInterface) => outputStage(item, true, true);

    //==================================================| style
    const isSelectedHighlight = (index: number) => selectedFilteredOptionIndex === index;
    const isSelectedOption = (option: ComponentOptionInterface) => {
        if (!outputValueObj) return false;
        if (dropdown_select === 'multiple') {
            return Array.isArray(outputValueObj) && outputValueObj.some((item: IndexValueTextInterface) => item.value === option.value && item.text === option.text);
        }
        return outputValueObj?.value === option.value && outputValueObj?.text === option.text;
    };

    //==================================================| Render
    return (
        <div className="arc-select" ref={wrapperRef}>
            <div className="arc-select-input-wrapper">
                <input
                    type="text"
                    className={`custom-input ${required ? 'required' : ''}`}
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onClick={onClickInput}
                    onKeyUp={onKeyUpInput}
                    placeholder={placeholder}
                    readOnly={!dropdown_search}
                    required={required}
                />
            </div>

            {dropdown_select === 'multiple' && (
                <ul className="arc-select-multiple">
                    {(outputValueObj as IndexValueTextInterface[] | null)?.map((item, index) => (
                        <li key={index} onClick={() => onClickLiMultiple({ index, value: item.value, text: item.text })}>
                            {item.text}
                        </li>
                    ))}
                </ul>
            )}

            <div className={`arc-select-option  ${slideState ? 'arc-select-slide-in' : 'arc-select-slide-out'}`}>
                <ul ref={ulRef}>
                    {filteredOption.map((option, index) => (
                        <li
                            key={index}
                            className={[
                                isSelectedHighlight(index) ? 'arc-select-selected' : '',
                                isSelectedOption(option) ? 'arc-select-selectedOption' : '',
                            ].join(' ')}
                            onClick={() => onClickLi({ index: index, value: option.value, text: option.text })}
                        >
                            {dropdown_select === 'multiple' && <input type="checkbox" checked={isSelectedOption(option)} readOnly />}
                            <span title={option.title ?? ''}>{option.text}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

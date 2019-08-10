import {
    useState
} from 'react';

export default function (init) {
    let [value, setValue] = useState(init);

    const onChange = function(e){
        setValue(e.target.value)
    }

    return {
        value,
        onChange,
        setValue,
    }
}
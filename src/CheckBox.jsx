import { useState } from 'react';
import './check_box.scss';
const CheckBox = (props) => {
    const {ele, selectUnselect} = props;
    const [showChildren, setChildren] = useState(false);
    const cbId = 'checkBox-'+Math.round(Math.random() * new Date().getTime());
    const isChecked = ele.checked;
    return(
        <div className='cb-block'>
            {ele.children.length ? 
                <div 
                    className={'bullet-arrow '+(showChildren ? 'open' : '')}
                    onClick={() => setChildren(!showChildren)}
                >
                </div> : 
                null
            }
            <label htmlFor={cbId} className='cb-label'>
                <input 
                    id={cbId}
                    type='checkbox'
                    checked={isChecked}
                    onChange={(e) => selectUnselect(e, ele)}
                />
                <span className='mgl-5'>{ele.name}</span>
            </label>
            {showChildren ? props.children : null}
        </div>
    )
}

export default CheckBox;

import { useState } from 'react';
import PropTypes from 'prop-types';
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
                    ref={input => {
                        if(input){
                            input.indeterminate = ele.indeterminate
                        }
                    }} 
                    id={cbId}
                    className={`check-mark ${ele.indeterminate ? 'partial-select' : ''}`}
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

CheckBox.propTypes = {
    ele: PropTypes.object,
    selectUnselect: PropTypes.func
};

CheckBox.defaultProps = {
    ele: {},
    selectUnselect: () => {}
}

export default CheckBox;

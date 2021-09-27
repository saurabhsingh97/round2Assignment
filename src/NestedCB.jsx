import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import CheckBox from './CheckBox';
import Output from './Output';
import {getChildMappingObj, getFormattedArray} from './utils';
import './nested_cb.scss';
const NestedCB = (props) => {
    const {cbArr, onUpdate} = props;
    const [selectedEle, setSelectedEle] = useState([]);
    var selectedIds = [...selectedEle];
    
    const childMappingObj = useMemo(() => getChildMappingObj(cbArr), [cbArr]);
    const formattedCBArr = useMemo(() => getFormattedArray(cbArr, childMappingObj), [cbArr, childMappingObj]);

    const getEleFromLabel = (label) => {
        const accessIndexArr = label.split('-');
        accessIndexArr.splice(0,1);
        let returnEle = formattedCBArr;
        for(let i=0; i<accessIndexArr.length; i++){
            const accessIndex = accessIndexArr[i];
            if(i === accessIndexArr.length-1){
                returnEle = returnEle[accessIndex];
            }else{
                returnEle = returnEle[accessIndex].children;
            }
        }
        return returnEle;
    }

    const getSelectedChildren = (parentEleLabel) => {
        const noOfChildren = childMappingObj[parentEleLabel].length;
        let selectedChildCount = 0;
        childMappingObj[parentEleLabel].forEach(cur => {
            if(selectedIds.includes(cur.name)){
                selectedChildCount++;
            }
        })
        return {
            isAllSelected: selectedChildCount === noOfChildren,
            selectedChildCount
        }
    }

    const partialySelect = (ele) => {
        ele.indeterminate = true;
        const indexToRemove = selectedIds.indexOf(ele.name);
        if(indexToRemove > -1){
            selectedIds.splice(indexToRemove, 1);
        }
        if(ele.parentId){
            const parentLabel = ele.parentId;
            const parentEle = getEleFromLabel(parentLabel);
            if(parentEle.checked){
                partialySelect(parentEle);
            }
        }
    }
    
    const updateHierarchy = (ele, type, flowDirection) => {
        if(type === 'select'){
            ele.checked = true;
            ele.indeterminate = false;
            selectedIds.push(ele.name);
            if(flowDirection!=='out' && ele.children.length){
                ele.children.forEach((cur) => {
                    selectedIds = updateHierarchy(cur, 'select', 'in');
                })
            }
            if(flowDirection!=='in' && ele.parentId){
                const parentEleLabel = ele.parentId;
                const parentEle = getEleFromLabel(parentEleLabel);
                const { isAllSelected } = getSelectedChildren(parentEleLabel);
                if(isAllSelected){
                    selectedIds = updateHierarchy(parentEle, 'select', 'out');
                }else{
                    parentEle.indeterminate = true;
                }
            }
        }else{
            ele.checked = false;
            ele.indeterminate = false;
            const indexToRemove = selectedIds.indexOf(ele.name);
            if(indexToRemove > -1){
                selectedIds.splice(indexToRemove, 1);
            }
            if(flowDirection!=='out' && ele.children.length){
                ele.children.forEach((cur) => {
                    selectedIds = updateHierarchy(cur, 'deSelect', 'in');
                })
            }
            if(flowDirection!=='in' && ele.parentId){
                const parentEleLabel = ele.parentId;
                const parentEle = getEleFromLabel(parentEleLabel);
                const { selectedChildCount } = getSelectedChildren(parentEleLabel);
                if(!selectedChildCount){
                    selectedIds = updateHierarchy(parentEle, 'deSelect', 'out'); 
                }else{
                    partialySelect(parentEle);
                }
            }
        }
        return selectedIds;
    }
    
    const selectUnselect = (event, ele) => {
        let tempSelectedIds;
        if(event.target.checked){
            tempSelectedIds = updateHierarchy(ele, 'select');
        }else{
            tempSelectedIds = updateHierarchy(ele, 'deSelect');
        }
        const distinctSelectedEle = [...new Set(tempSelectedIds)]
        setSelectedEle(distinctSelectedEle);
        onUpdate(distinctSelectedEle);
    }
    
    const cbProps = {
        selectUnselect
    }
    
    const renderCheckBox = (arr) => {
        const list = arr.map(cur => {
            const comp = (
                <CheckBox ele={cur} key={cur.name} {...cbProps}>
                    {cur.children.length ? renderCheckBox(cur.children) : null}
                </CheckBox>
            );
            return comp;
        });
        return list;
    }

    return(
        <>
            <div className='cb-container'>
                {renderCheckBox(formattedCBArr)}
            </div>
            <Output selectedEle={selectedEle} />
        </>
    )
}

NestedCB.propTypes = {
    cbArr: PropTypes.array,
    onUpdate: PropTypes.func
};

NestedCB.defaultProps = {
    cbArr: [],
    onUpdate: () => {}
}

export default NestedCB;

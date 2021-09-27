import { useState, useMemo } from 'react';
import CheckBox from './CheckBox';
import {getChildMappingObj, getFormattedArray} from './utils';
import './nested_cb.scss';
const NestedCB = (props) => {
    const {cbArr} = props;
    const [selectedEle, setSelectedEle] = useState([]);
    var selectedIds = [...selectedEle];
    
    const childMappingObj = useMemo(() => getChildMappingObj(cbArr), [cbArr]);
    const formattedCBArr = useMemo(() => getFormattedArray(cbArr, childMappingObj), [cbArr]);

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

    const isEveryChildSelected = (parentEleLabel) => {
        const noOfChildren = childMappingObj[parentEleLabel].length;
        let selectedChildCount = 0;
        childMappingObj[parentEleLabel].forEach(cur => {
            if(selectedIds.includes(cur.name)){
                selectedChildCount++;
            }
        })
        return selectedChildCount === noOfChildren;
    }
    
    const updateHierarchy = (ele, type, flowDirection) => {
        if(type === 'select'){
            ele.checked = true;
            selectedIds.push(ele.name);
            if(flowDirection!=='out' && ele.children.length){
                ele.children.map((cur) => {
                    selectedIds = updateHierarchy(cur, 'select', 'in');
                })
            }
            if(flowDirection!=='in' && ele.parentId){
                const parentEleLabel = ele.parentId;
                const isAllSelected = isEveryChildSelected(parentEleLabel);
                if(isAllSelected){
                    const parentEle = getEleFromLabel(parentEleLabel);
                    selectedIds = updateHierarchy(parentEle, 'select', 'out');
                }
            }
        }else{
            if(flowDirection!=='out' && ele.children.length){
                ele.children.map((cur) => {
                    selectedIds = updateHierarchy(cur, 'deSelect', 'in');
                })
            }
            if(flowDirection!=='in' && ele.parentId){
                const parentEleLabel = ele.parentId;
                const parentEle = getEleFromLabel(parentEleLabel);
                selectedIds = updateHierarchy(parentEle, 'deSelect', 'out');   
            }
            ele.checked = false;
            const indexToRemove = selectedIds.indexOf(ele.name);
            if(indexToRemove > -1){
                selectedIds.splice(indexToRemove, 1);
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
        setSelectedEle([...new Set(tempSelectedIds)]);
    }
    
    const cbProps = {
        selectUnselect,
        selectedEle
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
        <div className='cb-container'>
            {renderCheckBox(formattedCBArr)}
            Selected Elements :-
            {selectedEle.map(cur => <div key={cur}>{cur}</div>)}
        </div>
    )
}

export default NestedCB;
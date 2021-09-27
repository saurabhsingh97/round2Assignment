export const getChildMappingObj = (arr) => {
    const mapObj = arr.reduce((acc, cur) => {
        const {parentId, checked=false} = cur;
        const levelNo = cur.name.split('-').length - 2;
        if(parentId){
            if(!acc[parentId]){
                acc[parentId] = [];
            }
            acc[parentId].push({
                ...cur,
                levelNo,
                checked
            })
        }
        return acc;
    }, {})
    return mapObj;
}
const getList = (arr, childMapObj) => {
    const list = arr.map((cur) => {
        const cbLabel = cur.name;
        const cbChilldren = childMapObj[cbLabel] || [];
        cur.children = cbChilldren.length ? getList(cbChilldren, childMapObj) : [];
        return cur;
    });
    list.sort((a,b) => a.name.slice(-1) - b.name.slice(-1));
    return list;
}
export const getFormattedArray = (arr, childMapObj) => {
    const onlyParentCheckBox = arr.reduce((acc, cur) => {
        if(!cur.parentId){
            acc.push({
                ...cur,
                levelNo: 0,
                checked: cur.checked || false
            });
        }
        return acc;
    }, []);
    const formattedArr = getList(onlyParentCheckBox, childMapObj);
    return formattedArr;
}
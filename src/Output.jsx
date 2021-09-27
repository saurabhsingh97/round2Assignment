import './output.scss';
const Output = (props) => {
    const { selectedEle } = props;
    const selectedCount = selectedEle.length;
    return(
        <div className='output-container'>
            <h3>Selected Elements({selectedCount}) :-</h3>
            {selectedCount ? 
                selectedEle.map(cur => <div className='element' key={cur}>{cur}</div>) : 
                <div className='element'>No Elements Selected</div>
            }
        </div>
    )
}
export default Output;

import NestedCB from './NestedCB';
const App = () => {
  const cbArr = [{
    name: '0-0',
    parentId: null
    },{
    name: '0-1',
    parentId: null,
    },{
    name: '0-2',
    parentId: null,
    },{
    name: '0-0-0',
    parentId: '0-0',
    },{
    name: '0-0-0-0',
    parentId: '0-0-0',
    },{
    name: '0-0-0-1',
    parentId: '0-0-0',
    },{
    name: '0-0-0-2',
    parentId: '0-0-0',
    },{
    name: '0-0-1-0',
    parentId: '0-0-1',
    },{
    name: '0-0-1-1',
    parentId: '0-0-1',
    },{
    name: '0-0-1-2',
    parentId: '0-0-1',
    },{
    name: '0-0-2',
    parentId: '0-0',
    },{
    name: '0-1-0',
    parentId: '0-1',
  },{
    name: '0-0-1',
    parentId: '0-0',
  }];    
  return (
    <div className="App">
      <NestedCB cbArr={cbArr}/>
    </div>
  );
}

export default App;

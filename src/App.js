
import { useState } from 'react';
import Main from './components/main';

function App() {
  var [url,seturl]=useState("")

  const fetch=()=>{
    window.chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      var urla = tabs[0].url;
      seturl(urla)
  })
}
  return (
    <div className="w-max h-max">
      <Main />
    </div>
  );
}

export default App;

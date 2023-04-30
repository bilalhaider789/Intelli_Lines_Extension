

import { useEffect, useState } from 'react'
import logo from './../Images/logo.png'
import { Slider } from '@mui/material'
import { SyncLoader } from 'react-spinners'


export default function Main(){
    const [type, settype]=useState("sum")
    const [lang, setlang]=useState("eng")
    const [ratio, setratio]=useState(25)
    // const [url, seturl]=useState("https://www.youtube.com/watch?v=TKgQXhl0Whk&ab_channel=PublicNews")
    const [url, seturl]=useState("")
    const [data,setdata]=useState("")
    const [error, seterror]=useState(true)
    const [errormess, seterrormess]=useState("")
    const [screen, setscreen]=useState("main")
    const [loading,setloading]=useState(false)
    const [keywords,setkeywords]=useState([])
    const [sumresult, setsumresult]=useState("")
    const [keyresult, setkeyresult]=useState([])

    useEffect(() => {
        window.chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
            var urla = tabs[0].url;
            seturl(urla)
        })
    }, []);
   
    const fetchurl=()=>{
        window.chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
          var urla = tabs[0].url;
          seturl(urla)
      })
    }

    async function fetchUserData() {
        setloading(true)
        try {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://127.0.0.1:5000/extension?url="+url+"&ratio="+ratio+"&lang="+lang, true);
        xhr.onload = function() {
            var text = xhr.responseText;
            console.log(JSON.parse(text))
            var fetcheddata=JSON.parse(text)
            if(fetcheddata.success=="0"){
                seterror(true)
                seterrormess(fetcheddata.message)
                setloading(false)
            }
            else{
                setkeywords(JSON.parse(fetcheddata.keywords))
                setdata((text))
                setscreen("result")
                setloading(false)
                if(type=="sum"){
                    setsumresult(fetcheddata.summary)
                }
                else{
                    var sentences= (fetcheddata.summary).split(/[.?۔]+/)
                    setkeyresult(sentences)
                }
            }
            
        }
        xhr.send();
        } catch (error) {
          console.error("Error fetching user data:", error);
          setloading(false)
        }
      }

    return(
        <div>
            {screen=="main" && <div className="w-[350px] h-[600px] flex flex-col items-center px-8">
                <img src={logo}  className='h-28 mt-4'/>
                <div className='font-poppins mt-2 font-semibold text-[28px]'> Intelli-Lines </div>
                <div className='text-xl'>
                    What do you want to generate :
                </div>
                <div className='flex font-semibold mt-4 cursor-pointer text-xl'>
                    <div className={type==="sum"? "border-gray-500 px-2 rounded-l-xl border bg-green-500 text-white":"border-gray-500 px-2 rounded-l-xl border"} onClick={()=>settype("sum")}>Summary</div>
                    <div className={type==="key"?'border-gray-500 px-2 rounded-r-xl border bg-green-500 text-white':"'border-gray-500 px-2 rounded-r-xl border"} onClick={()=>settype("key")}>Key Points</div>
                </div>
                <div className='flex font-semibold mt-4 cursor-pointer text-xl'>
                    <div className={lang==="eng"? "border-gray-500 px-2 rounded-l-xl border bg-green-500 text-white":"border-gray-500 px-2 rounded-l-xl border"} onClick={()=>setlang("eng")}>English</div>
                    <div className={lang==="ur"?'border-gray-500 px-2 rounded-r-xl border bg-green-500 text-white':"'border-gray-500 px-2 rounded-r-xl border"} onClick={()=>setlang("ur")}>Urdu</div>
                </div>
                <div className='mt-4'>
                    Select result length:
                </div>
                <div className='flex font-semibold gap-2 items-center w-64 text-xl'>
                    <div>5%</div>
                    <Slider defaultValue={25} aria-label="Default" valueLabelDisplay="auto" className='w-60  ' min={5} max={80} step={5} color='primary' onChange={(e)=>setratio(e.target.value)}/>
                    <div>80%</div>
                </div>
                <div className='flex font-semibold text-sm'>url :<div className='font-semibold ml-2'>{url.includes("youtube")?url.substring(12,43):"Please apply this extension on Youtube"}</div></div>
                <div className='flex w-full justify-center gap-4'>
                    <div
                      className="py-2 px-4 mt-4 hover:bg-green-600 rounded-2xl text-white bg-[#34bd32] font-semibold cursor-pointer"
                      onClick={() => {
                        fetchurl()
                      }}
                    >Fetch Url</div>
                    <div
                  className="py-2 px-4 mt-4 hover:bg-green-600 rounded-2xl text-white bg-[#34bd32] font-semibold cursor-pointer"
                  onClick={() => {
                    fetchUserData()
                  }}
                >Generate</div>
                </div>
                {error && <div className='text-red-600 font-semibold mt-4'>{errormess}</div>}
            </div>}
            {
                screen=="result" &&
                <div className='w-[400px] h-[650px] m-2 p-2 border-gray-600'>
                    <div className='font-semibold'>Generated Keywords:</div>
                    <div className="flex flex-wrap text-md mt-4 w-full pr-4 gap-y-2 cursor-pointer">                        {
                        keywords.map(item => <p className="border-2 rounded-2xl px-2 mx-2 border-black font-urdu">
                        {item}
                    </p>)
                    }
                    </div>
                    <div className='font-semibold mt-4'>Generated Result:</div>
                    <div className='h-[500px] overflow-auto no-scrollbar border-2 border-gray-400 rounded-lg p-1 mt-2 text-md'>
                        {(type=="sum" && lang=="eng") && <div>{sumresult}</div>}
                        {(type=="sum" && lang=="ur") && <div className='text-right font-urdu' dir='auto'>{sumresult}</div>}
                        {(type=="key" && lang=="eng")&& 
                        <div>
                            {keyresult.map((item)=>(item !="" ?<p>◉ {item}.</p>:<p></p>))}    
                        </div>}
                        {(type=="key" && lang=="ur")&& 
                        <div>
                            {keyresult.map((item)=>(item !="" ?<div className="flex flex-row-reverse text-right font-urdu"><p>◉</p><p>  {item}</p></div>:<p></p>))}    
                        </div>}
                    </div>
                    <div className='flex w-full justify-center gap-4 mb-4 pb-4'>
                    <div
                      className="py-2 px-4 mt-4 hover:bg-green-600 rounded-2xl text-white bg-[#34bd32] font-semibold cursor-pointer"
                      onClick={() => {
                        setscreen("main")
                      }}
                    >Re-Generate</div>
                    <div
                  className="py-2 px-4 mt-4 hover:bg-green-600 rounded-2xl text-white bg-[#34bd32] font-semibold cursor-pointer"
                  onClick={() => {
                    fetchUserData()
                  }}
                >Download in PDF</div>
                </div>
                </div>
            }
            {loading && <div>
          <div className="bg-gray-400 opacity-40 h-full w-full absolute top-0 left-0"></div>
          <div className="bg-transparent h-full w-full absolute top-0 left-0 flex justify-center items-center">
            <SyncLoader color={"#36d7b7"} loading={loading} size={15} />
          </div>
        </div>}
        </div>
    )
}
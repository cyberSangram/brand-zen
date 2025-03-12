"use client";
import { useState, useEffect } from "react";
import { RiBardFill, RiFileCopyLine } from "@remixicon/react";
import { ChevronRightIcon, ArrowDownIcon } from "@heroicons/react/16/solid";

interface bodyObject {
    brandDescription: string,
    tagsArray: string[]
  }
  
  const fetcher = async (url: string, method: string, body:bodyObject ) => {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  
    if (!res.ok) {
      throw new Error('Failed to fetch');
    }
  
    const data = await res.json();
    return data;
  };
  

const Landing = () => {

    const [brandDescription, setBrandDescription] = useState<string>("");
      const [tag, setTag] = useState<string>("");
      const [tagsArray, setTagsArray] = useState<string[]>([]);
      const [isValid, setIsValid] = useState<boolean>(false);
      const [validationMessage, setValidationMessage] = useState<string>("");
      const [loading, setLoading] = useState<boolean>(false);
      const [data, setData] = useState<string[]>([]);
      const [error, setError] = useState<Error>(null);
      const [isCopied, setIsCopied] = useState<boolean>(false);
    
      const addTags = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && tag.trim() !== "" && tagsArray.length < 10) {
          event.preventDefault();
          setTagsArray([...tagsArray, tag.trim()]);
          setTag("");
        }
      };
    
      const deleteTag = (index: number) => {
        const newTagsArray = tagsArray.filter((_, i) => i !== index);
        setTagsArray(newTagsArray);
      };
    
      useEffect(() => {
        const isBrandValid = brandDescription.trim().length >= 30;
        const areTagsValid = tagsArray.length >= 3;
        setIsValid(isBrandValid && areTagsValid);
    
        if (isBrandValid && areTagsValid) {
          setValidationMessage("All fields are correct! Ready to Generate your Brand Name.");
        } else if (!isBrandValid && !areTagsValid) {
          setValidationMessage("Brand description must be at least 30 characters long. At least 3 tags should be added.");
        } else if (!isBrandValid) {
          setValidationMessage("Brand description must be at least 30 characters long.");
        } else {
          setValidationMessage(`At least 3 tags should be added. Add ${3 - tagsArray.length} more tag(s) now`);
        }
      }, [brandDescription, tagsArray]);
    
      const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isValid) {
          setLoading(true);
          setError(null);
          setData([]);
          try {
            const result = await fetcher('/api/generate', 'POST', { brandDescription, tagsArray });
            setData(result.brandNames);


          } catch (err) {
            setError(err);
          } finally {
            setLoading(false);
          }
        }
      };
      
      const handleCopy = async () => {
          const copyField = data.join(" ");
          try {
            await navigator.clipboard.writeText(copyField)
            setIsCopied(true)

            // setting the copy state to false after 3 seconds
            setInterval(() => setIsCopied(false), 2000)

          } catch (err) {
            console.log(err)
        }
      }

      const scrollDown = (percentage: number) => {
        if(data.length !== 0) {
          percentage = 0.27
        }
        window.scrollTo({
          top: document.body.scrollHeight * percentage,
          behavior: 'smooth'
        })
      }

    return (
        <div className="flex items-center flex-col px-4 py-4 md:px-16 md:py-6 w-full min-h-screen bg-[#000] font-primary bg-[radial-gradient(#ffffff25_0.6px,#14001d2a_0.6px)] md:bg-[radial-gradient(#ffffff25_1px,#14001d2a_1px)] bg-[size:10px_10px] md:bg-[size:20px_20px] overflow-hidden ">

        {/* gradient blob */}
        <div className=" absolute h-[200px] w-[200px] md:h-[800px] md:w-[800px] rounded-full bg-gradient-to-b from-indigo-300/40 via-indigo-500/10 to-transparent 
        -top-20 left-40 md:-top-80 md:left-80 filter blur-3xl z-0"></div>

        {/* navbar */}
        <div className="flex justify-center md:justify-between w-full items-center">
            {/* brand logo */}
            <h1 className=" font-primary text-2xl font-bold md:text-3xl bg-gradient-to-tl from-slate-800 via-indigo-500 to-indigo-600 bg-clip-text text-transparent  transition-all duration-300 hover:animate-ease-in cursor-pointer motion-preset-pop motion-duration-2000">BrandZen</h1>

            {/* primary cta */}
            <button 
            onClick={() => scrollDown(0.6)} 
            className="hidden group md:flex items-center justify-center z-1 py-2 px-6 rounded-full  font-bold filter backdrop-blur-xs bg-gradient-to-b from-transparent via-indigo-500/10 to-indigo-500/10 border-1 border-indigo-600/20 motion-preset-expand motion-duration-1500 cursor-pointer transition-shadow  duration-300 delay-none hover:shadow-[0px_5px_15px_1px_rgba(79,_57,_246,_0.45)] shadow-sm shadow-indigo-500/20 hover:bottom-1 hover:border-indigo-600/30">

              <RiBardFill
                    size={20}
                    className="mr-2 group-hover:motion-preset-pop motion-duration-500 text-indigo-500"
                  />
                  
              <span className="group-hover:motion-preset-shrink motion-duration-500 text-base text-indigo-500 ">Generate</span>
            </button>

        </div>

        {/* hero section */}
        <div className="w-full h-full md:mt-16 mt-8 flex items-center md:justify-center md:items-center flex-col">

            {/* pill component */}
            <div className="group relative cursor-pointer motion-preset-rebound-up motion-duration-2000">
                {/* background shadow */}
                <div className="absolute inset-0 p-[0.5px] rounded-full bg-gradient-to-tl from-slate-800 via-indigo-500 to-indigo-600/5 blur-xs group-hover:-inset-0.5 transition-all duration-700 group-hover:duration-700">
                </div>
                {/* pill gradient border */}
                <div className="relative p-[0.5px] rounded-full bg-gradient-to-tl from-slate-800 via-indigo-500 to-indigo-600">

                    <div className="flex gap-1 md:gap-2 justify-center items-center rounded-full px-8 py-1.5 text-sm md:px-12 md:py-1 md:text-sm font-bold text-indigo-300 bg-gradient-to-b from-neutral-900 to-neutral-950 ">
                        <span className="">✨ Craft Your Brand with AI</span> 
                        <ChevronRightIcon className="size-6 md:size-7 md:p-0 text-indigo-500 transition-all duration-300 delay-100 group-hover:md:ml-2 group-hover:ml-1"/>
                        
                    </div>
                </div>
            </div>
            
            {/* heading */}
            <h1 className="font-tertiary font-bold text-3xl text-center  md:text-5xl w-[83%] md:w-[90%] leading-[120%] mt-6 mb-8 md:mt-10 md:mb-10 bg-gradient-to-tl from-indigo-900 via-indigo-200 to-indigo-100 bg-clip-text text-transparent motion-preset-expand motion-duration-2000">

            Revolutionize Your Brand Identity with Cutting-Edge AI 
            </h1>

            {/* subheading */}
            <h2 className="font-tertiary text-sm md:text-base w-[90%] leading-normal font-medium md:font-medium text-indigo-300  md:w-[65%] text-center mb-12 md:mb-14 md:leading-7 motion-preset-slide-up motion-duration-2000">Harness the Power of AI to Craft Unique, Memorable, and Tailored Brand Names Effortlessly, Elevating Your Business to New Heights and Ensuring It Stands Out in the Market!</h2>

            {/* horizontal line */}
                <div className="relative w-[50%] md:w-[30%] h-1 md:h-2 rounded-full bg-gradient-to-b from-indigo-500 to-indigo-900 border-1 border-indigo-600 transition-all duration-300 drop-shadow-[0_10px_10px_rgba(79,_57,_246,_0.5)] motion-preset-rebound-right motion-duration-2000"></div>

                {/* scroll-down button */}
                <button onClick={() => scrollDown(0.6)} className="mt-10 h-14 w-14 md:mt-16 md:h-16 md:w-16 rounded-full flex items-center justify-center z-1 font-bold filter backdrop-blur-xs bg-gradient-to-b from-transparent via-indigo-500/10 to-indigo-500/10 border-1 border-indigo-600/25 motion-preset-expand cursor-pointer transition-shadow  duration-300 delay-none hover:shadow-[0px_5px_15px_1px_rgba(79,_57,_246,_0.45)] shadow-sm shadow-indigo-500/40 hover:bottom-1 hover:border-indigo-600/30 text-indigo-500 motion-preset-oscillate motion-duration-2000">
                    <ArrowDownIcon
                        className="md:size-7 size-6 p-0"
                    />  
                </button>
        </div>

        {/* generate section */}
        <div className="w-full h-full mt-14 md:mt-16 flex justify-center items-center flex-col ">

            {/* heading */}
            <h2 className="font-tertiary font-bold text-2xl w-[90%] text-center mt-16 md:text-5xl md:w-[90%] md:text-center leading-[120%] md:mt-24 md:mb-10 bg-gradient-to-tl from-indigo-900 via-indigo-200 to-indigo-100 bg-clip-text text-transparent mb-4">
                Let&#39;s Generate!
            </h2>

            {/* user input  */}
           
            <div className=" w-[90%] mt-4 mb-8 md:w-[460px] h-auto md:mt-4 md:mb-12 relative flex justify-center backdrop-blur-md text-xs px-6 py-4 md:px-10 md:py-8 text-indigo-300 rounded-xl bg-indigo-950/30 border-2 border-indigo-500/10 shadow-[0px_5px_20px_1px_rgba(79,_57,_246,_0.2)]">

                {/* gradient blob */}
                <div className=" absolute h-[200px] w-[200px] md:h-[850px] md:w-[850px] rounded-full bg-gradient-to-b from-indigo-400/30 via-indigo-500/15 to-transparent -top-20 -right-30 md:-top-20 md:right-140 filter blur-3xl z-0"></div>

                {/* gradient blob */}
                <div className=" absolute h-[200px] w-[200px] md:h-[850px] md:w-[850px] rounded-full bg-gradient-to-b from-indigo-400/30 -top-20 right-30 via-indigo-500/15 to-transparent md:-top-20 md:left-140 filter blur-3xl z-0"></div>

                <form className="w-[100%] h-[100%]" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="brandDescription" className="font-primary text-sm font-bold block text-indigo-200">
                    Describe Your Brand in Brief
                    </label>
                    <textarea
                    name="brandDescription"
                    value={brandDescription}
                    onChange={(e) => setBrandDescription(e.target.value)}
                    placeholder="eg:- Innovative, high-performance sportswear brand..."
                    required
                    autoComplete="off"
                    className="w-full h-[90px] text-sm py-1 px-2.5 md:h-[100px] md:py-2 md:px-3 border-1 border-indigo-700/20 rounded-sm mt-2 mb-1.5 md:mt-1.5 md:mb-2.5 font-primary bg-indigo-950/30 resize-none md:text-sm overflow-auto scrollbar-thin scrollbar-thumb-indigo-400/50 scrollbar-track-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-transparent text-indigo-200/80 placeholder:text-indigo-300/70"
                    />
                </div>
                <label htmlFor="tags" className="font-primary text- md:text-sm text-sm font-bold block text-indigo-200">
                    Ideal Tags/Names for Your Brand Identity
                </label>
                <div className="w-full py-1.5 px-2.5 md:py-3 md:px-3 h-[120px] md:h-[100px] overflow-y-auto overflow-x-hidden border-1 border-indigo-700/20 rounded-sm mt-2 mb-1.5 md:mt-1.5 md:mb-1 font-primary bg-indigo-950/30 scrollbar-thin scrollbar-thumb-indigo-400/50 scrollbar-track-transparent flex-wrap text-indigo-200/80 placeholder:text-indigo-300/70">
                    <div>
                    {tagsArray.map((tag, index) => (
                        <div
                        key={index}
                        className="inline-block px-1.5 py-0.5 mr-1.5 pr-0.5 mb-1 md:px-3 md:py-0.5 md:mr-1.5 md:mb-1.5 md:pr-0.5 bg-gradient-to-b from-transparent via-indigo-500/10 to-indigo-500/10 border-1 border-indigo-600/20 text-indigo-300 rounded-2xl md:text-sm text-xs font-bold items-center justify-center"
                        >
                        {tag}
                        <span
                            className="ml-1 md:ml-1 bg-red-500/20 px-1.5 md:px-1.5 rounded-xl font-bold text-md text-red-500 border-1 border-red-500/15 cursor-pointer hover:motion-preset-focus"
                            onClick={() => deleteTag(index)}
                        >
                            x
                        </span>
                        </div>
                    ))}
                    </div>
                    {tagsArray.length < 10 ? (
                    <input
                        type="text"
                        autoComplete="none"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        onKeyDown={addTags}
                        placeholder="eg:- motion, velocity, athletic..."
                        className="inline-block w-full border-none font-primary text-sm md:text-sm outline-none focus:outline-none text-slate-400 placeholder:text-indigo-300/70"
                    />
                    ) : (
                    <div className="text-green-500 text-xs font-bold bg-green-500/10 rounded-md border-1 border-green-500/15 p-1 md:p-1.5 w-fit">
                        Maximum of 10 tags allowed
                    </div>
                    )}
                </div>
                <div className="text-slate-400 text-xs font-bold mb-2 md:mb-4">Tags: ({tagsArray.length} / 10)</div>
                <div
                    className={`text-xs font-bold  mb-6 p-2.5 md:mb-6 md:p-2 rounded-md motion-preset-expand ${
                    isValid ? "text-green-500 bg-green-500/10 border-1 border-green-500/15" : "text-red-500 bg-red-500/10 border-1 border-red-500/15"
                    }`}
                >
                    {validationMessage}
                </div>
                <button
                    type="submit"
                    className="group flex items-center justify-center w-full z-1 py-1 md:py-2 md:px-6 rounded-full font-bold filter backdrop-blur-xs bg-gradient-to-b from-transparent via-indigo-500/10 to-indigo-500/10 border-1 border-indigo-600/20 motion-preset-expand cursor-pointer transition-shadow  duration-300 delay-none hover:shadow-[0px_5px_15px_1px_rgba(79,_57,_246,_0.45)] shadow-sm  shadow-indigo-500/20 hover:bottom-1 hover:border-indigo-600/30 md:h-12 h-10"
                >
                    
                    
                    { !loading ?
                      <>
                        <RiBardFill
                        className="my-icon mr-1 md:mr-2 text-indigo-500 group-hover:motion-preset-pop motion-duration-500 md:size-6 size-5"
                        />

                        <span className="group-hover:motion-preset-shrink motion-duration-500 md:text-xl text-base  text-indigo-500 ">Generate</span>
                      </>
                      : <span className=" flex gap-1 md:gap-2 ">
                          <div className="rounded-full md:size-3 size-2 bg-indigo-500 motion-preset-oscillate motion-duration-600"></div>
                          <div className="rounded-full md:size-3 size-2 bg-indigo-500 motion-preset-oscillate motion-duration-700"></div>
                          <div className="rounded-full md:size-3 size-2 bg-indigo-500 motion-preset-oscillate motion-duration-800"></div>
                          <div className="rounded-full md:size-3 size-2 bg-indigo-500 motion-preset-oscillate motion-duration-900"></div>

                      </span>
                    }
                    
                </button>
                </form>
            </div>
            </div>

            {loading ? (
                <div></div>
                    ) : error ? (
                <div>Error: {error.message}</div>
                    ) : data.length > 0 ? (
                <div className=" md:w-[90%] w-[90%] md:mt-4 flex flex-wrap justify-center md:ap-3">

                    <h2 className="font-tertiary font-bold text-2xl md:text-5xl md:w-[90%] text-center leading-[120%] md:mt-10 md:mb-12 bg-gradient-to-tl from-indigo-900 via-indigo-200 to-indigo-100 bg-clip-text text-transparent motion-preset-expand mt-16 mb-4">
                        Explore Your Brand Names
                    </h2>

                    <div className="md:w-[80%] h-auto mt-4 mb-8 md:mt-4 md:mb-12 flex flex-wrap items-center justify-center md:gap-3 gap-2 backdrop-blur-sm text-xs md:text-xs px-3 py-3 md:px-10 md:py-6 text-indigo-300 rounded-xl bg-indigo-950/30 border-2 border-indigo-600/40">

                        <div className="w-full flex justify-center items-center flex-col">
                            {/* copy button */}
                            <button onClick={handleCopy} className="group flex items-center justify-center z-1 py-1.5 px-3.5 md:py-2 md:px-6 md:mb-3 mb-2  rounded-full  font-bold filter backdrop-blur-xs bg-gradient-to-b from-transparent via-indigo-500/10 to-indigo-500/10 border-1 border-indigo-600/20 motion-preset-expand cursor-pointer transition-shadow  duration-300 delay-none hover:shadow-[0px_5px_15px_1px_rgba(79,_57,_246,_0.45)] shadow-sm shadow-indigo-500/20 hover:bottom-1 hover:border-indigo-600/30">

                                <RiFileCopyLine             
                                className="md:mr-2 mr-1 size-5 md:12 group-hover:motion-preset-pop motion-duration-500 text-indigo-500"
                                />

                                <span className="group-hover:motion-preset-shrink motion-duration-500 text-sm md:text-base text-indigo-500 ">{isCopied ? "Copied" : "Copy All"}</span>
                            </button>
                            {/* horizontal line */}
                            <hr className="w-[80%] border-1 border-indigo-500/10 rounded-full mb-3" />
                        </div>

                        {data.map((name, index) => (
                            <button
                                key={index}
                                className="group flex items-center justify-center z-1 py-0.5 px-3 md:py-1 md:px-6 text-xs rounded-full font-bold filter backdrop-blur-xs bg-gradient-to-b from-transparent to-indigo-500/10 border-1 border-indigo-600/25 motion-preset-expand cursor-pointer transition-shadow duration-300 delay-none hover:shadow-[0px_3px_20px_1px_rgba(79,_57,_246,_0.3)] shadow-sm shadow-indigo-500/20 hover:border-1 hover:border-indigo-600/20 text-indigo-300 md:text-sm ">
                                {name}
                            </button>
                        ))}
                    </div>

                
                </div>
                ) : (
                <div className="font-secondary text-3xl font-bold text-slate-300 mt-4"></div>
                )}


    </div>
      


  );
};

export default Landing;

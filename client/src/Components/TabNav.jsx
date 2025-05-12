import React from 'react'

const TabNav = ({ tabs, activeTab, onTabClick }) => {
  return (
    <div className=" grid grid-cols-4 max-sm:grid-cols-2 w-full border-gray-200">
        { 
            tabs.map((tab, index) => ( 
                <button key={index} className={`px-1 max-sm:font-semibold flex-shrink-0 py-3 text-sm  justify-center flex gap-2 -mb-px font-semibold w-full  text-slate-700 ${activeTab === tab?.label ? 'border-b-2 border-blue-400 text-blue-400' : ''}`} onClick={() => onTabClick(tab?.label)} > 
                  {tab.label} 
                  <span className={`${activeTab === tab?.label ? ' bg-blue-400 text-white' : 'bg-slate-200'}   text-xs px-2 max-sm:text-[9px] py-0.5 rounded-full font-semibold`}>
                    {tab.count}
                  </span>
                </button> 
                )
            )
        }
    </div>
  )
}

export default TabNav
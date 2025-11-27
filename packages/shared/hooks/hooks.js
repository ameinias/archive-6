import { useState } from 'react';

export const useToggle = (initialState = false) => {
  const [toggleValue, setToggleValue] = useState(initialState);
  
  const toggler = () => { 
    setToggleValue(!toggleValue);
  };

  // const [toggleAdminSection, setToggleAdminSection] = useToggle(false)
  
  // <button onClick={setToggleAdminSection} className="toggle-button"> Admin</button>   

//   {toggleAdminSection && ( <></> ) }


  
  return [toggleValue, toggler];
};


export const useOtherHook = () => {
  // just format for adding the next hook when i need it. 
};


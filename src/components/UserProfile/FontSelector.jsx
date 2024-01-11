// FontSelector.jsx
import React, { useEffect, useState } from 'react';
import { Paper, Button } from '@mui/material';

const FontSelector = ({user, backgroundColor, onSelectFontType, onSubmit, save, saveReset}) => {
  
  const [fontButtonClicked, setFontButtonClicked] = useState(false);
  const [tempFont, setTempFont] = useState(user.fontFamily)
  const [tempFontWeight, setTempFontWeight] = useState(user.fontWeight)
  //const [isMouseOver, setIsMouseOver] = useState(false);
  const [selectedFont, setSelectedFont] = useState(user.fontFamily);
  const [selectedFontWeight, setSelectedFontWeight] = useState(user.fontWeight);
  const [isPaperOpen, setIsPaperOpen] = useState(false);


  const handleFontSubmit = (flag) => {
    onSelectFontType(tempFont, tempFontWeight);
    setSelectedFont(tempFont);
    setSelectedFontWeight(tempFontWeight)
    // Call the onSubmit callback when the submit button is clicked
    onSubmit(flag);

    setFontButtonClicked(flag);
    // You can also include additional logic related to the submit action if needed
  };

  function handleFontChange(fontButtonClicked = false) {
    if(!isPaperOpen) document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
    else document.body.style.backgroundColor = backgroundColor;
    if(fontButtonClicked)
    {
      if(isPaperOpen) setIsPaperOpen(false);
      else setIsPaperOpen(true);
    }
    else {
      setIsPaperOpen(false);
    }
  }

  function setFont(fontFamily, fontWeight = 400) {
    setTempFont(fontFamily);
    setTempFontWeight(fontWeight);

    onSelectFontType(fontFamily, fontWeight);
  }
  const buttonStyle = {
    fontFamily: tempFont,
    fontWeight: tempFontWeight,
    animation: fontButtonClicked ? 'fontChange 1.5s' : 'none',
  };

  useEffect(() => {
    if(save) {
      saveReset(false);
    }
  }, [save, saveReset])

  return (
    <div
    style={{position: 'relative'}}>
    
  <button  onClick={() => {handleFontChange(true)}} style={buttonStyle}>Change Font</button>
  
  {isPaperOpen && 
  <div style={{position: 'absolute', zIndex: 2, pointerEvents: 'auto', height: '100%', width: '100%' }}>
  <Paper   elevation={7} >
  <div style={{margin: '2%', padding: '2%'}}>
    <button  style={{fontFamily: 'Bebas Neue, sans-serif'}}
    onClick={() => setFont('Bebas Neue')}>Bebas Neue</button>
    <button style={{fontFamily: 'Edu TAS Beginner, sans-serif'}}
    onClick={() => setFont('Edu TAS Beginner')}>Edu TAS Beginner</button>
    <button  style={{fontFamily: 'Edu TAS Beginner, sans-serif', fontWeight: 700}}
    onClick={() => setFont('Edu TAS Beginner', 700)}>Edu TAS Beginner Bold</button>
    <button  style={{fontFamily: 'Inconsolata, sans-serif' }}
    onClick={() => setFont('Inconsolata')}>Inconsolata</button>
    <button  style={{fontFamily: 'Inconsolata, sans-serif', fontWeight: 900}}
    onClick={() => setFont('Inconsolata', 900)}>Inconsolata Bold</button>
    <button  style={{fontFamily: 'Lobster, sans-serif'}}
    onClick={() => setFont('Lobster')}>Lobster</button>
    <button style={{fontFamily: 'Roboto, sans-serif'}}
    onClick={() => setFont('Roboto')}>Roboto</button>
    <button  style={{fontFamily: 'Roboto, sans-serif', fontWeight: 700}}
    onClick={() => setFont('Roboto', 700)}>Roboto Bold</button>
    <button   style={{fontFamily: 'Shadows Into Light, sans-serif'}}
    onClick={() => setFont('Shadows Into Light')}>Shadows Into Light</button>
    <button   style={{fontFamily: 'sans-serif'}}
    onClick={() => setFont('sans-serif')}>Sans-Serif</button>
    <button   style={{fontFamily: 'sans-serif', fontWeight: 700}}
    onClick={() => setFont('sans-serif', 700)}>Sans-Serif Bold</button>
  </div>
  <button onClick={() => {handleFontSubmit(true);handleFontChange();}}>Submit</button>
  <button onClick={() => {handleFontChange(); setSelectedFont(selectedFont); setSelectedFontWeight(selectedFontWeight);
  setTempFont(selectedFont); setTempFontWeight(selectedFontWeight); onSelectFontType(selectedFont, selectedFontWeight);}}>Close</button>
  </Paper>
  
  </div>}
</div>
  );
};

export default FontSelector;
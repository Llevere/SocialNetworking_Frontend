import React, {useState, useEffect} from 'react'
import { Button, TextareaAutosize, Typography, Container, List, ListItem, ListItemText, Paper, CircularProgress,  
    AppBar, Toolbar, Box, Popover } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'
function SearchBar({refresh}) {
    
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  //const [userSearch, setUserSearched] = useState(false);
  const navigate = useNavigate();


    async function displayUser(userId, User) {
        console.log("Display user: " + userId + ' ' + JSON.stringify(User))
        navigate(`/profile/profile_id=${userId}`);
        setSearchText('')
        refresh();
        handleCloseMenu();
        //setUserSearched(true);
      }
    
      useEffect(() => {
        const handleDocumentClick = (event) => {
          // Check if the click is outside the Popover content
          if (anchorEl && !anchorEl.contains(event.target)) {
            handleCloseMenu();
          }
        };
      
        // Attach the event listener when the component mounts
        document.addEventListener('click', handleDocumentClick);
      
        // Detach the event listener when the component unmounts
        return () => {
          document.removeEventListener('click', handleDocumentClick);
          
        };
      }, [anchorEl]);
      
      function searchInputChange(searchText) {
        setSearchText(searchText);
      }
      
      const handleSearch = async () => {
        try {
          const response = await axios.get(`/search/${searchText}`);
          setSearchResults(response.data);
          //console.log(response.data);
          setAnchorEl(document.getElementById('search-button')); // Set anchor element for popover
        } catch (error) {
          console.error('Error searching users:', error);
        }
      };
    
      const handleCloseMenu = () => {
        setAnchorEl(null);
      };
    
      const handleEnterKeyDown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault(); // Prevent the default form submission behavior
         if(searchText.length > 0)
          handleSearch();

          //setSearchText('')
        }
      };
    


  return (
    <Container sx={{float: 'left', display: 'flex', flexDirection: 'row',padding: 0, margin: 0}}>
      <Link to="/" style={{height: '4.5rem', width: '4.5rem', marginRight: '10px'}}>
        <img
          style={{height: '100%', width: '100%', borderRadius: '10px', padding: 0, margin: 0, display: 'block'}}
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAMAAAC4XpwXAAAAZlBMVEUAAAD///+Xl5eRkZH39/dLS0uBgYGampro6Ojr6+v8/PwEBASLi4uvr6+enp4wMDA7OzscHBxhYWHX19fKyspnZ2fh4eEnJyfExMS2trampqY2NjZERERZWVl4eHhRUVFvb28PDw/HpT1iAAAEfUlEQVRoge3b23aqMBAGYEQOgggIFDzVw/u/5JZ2iSaZJP8ktL3YzmVX5ZMQcpoxWPxlBG/9rb/1t/7WdZG13f6QFsk5KdLDvmuzX9LzrC0/4ioQo4qbtM3yn9XzNm22gS62TdjzvgBH70P5ltUYlv1P6PmmttLfcdzADQDqWXkD7TFuKdgLIT1LB4b99QBCyEf0A9f+8g+z6P3JwR7jZO9/Nj0vHO0xElv3s+gt2tHpOLY++sbLHmPjrEeJN35v/chNjz5nwIPg08Dr9Uw/oPNiq3/1tfpqJnuMFVfvOSOrLW66N1+jr1yGN30Mmrun9cg+lfKiorseqeeug6s+TuSwR+ofnOvW8eUSj3G6h/7fPlD9gN9R0a6il+jX+v+l5jxCb1H7uJObc2XQA2LMV/XoCOKFejWjflR7nqqfQZyaP4x6cLbrOxAvCdyiBzubnoPtfqFwm36U+4msl+Ct08sGi640mKRHIH4icaseSB1P0tH1xN5RT0w6Oq3eNLOGVZcmW1FHF7AVjS8yqy4OEoIOL2ekQTs6FN9hf3DiQkfQ0Q4vPb6Is+wudXoOXyUU9D0DD+pco6PDnKwvObow4L3q11/Rr7Qe4UtoH30bkTre8F76a9O/6Ix9k5eekDrjAl56QOmczYuoc7f4K0KHdstDMsZZXCbsz8kjoE3IhtChx34xn0Zgu5Dng5/0PEY+GJt24+jTe97CpEfW6QnQscX4errIpGNf26J30EWe3S7gfdCig/NNp+jYAZFFDzF96vSTjg0ZFh0cLpeKjm1hLHqD6dOmZl794qpfZ9Aj8NRhmuInHTsxiI1jXQYeuEyL0oeeY4+sCtN7hJ2Adl9/TNNyCR50Nbmk805LloLOPsZW7n1x5Xzcb34nnjt6aDCH7vrG/ZTOenieeqHo+DGZv35QdMZ62lvfKXr/i3qv6OiZyRy6urbBN7Deeq2u61ivnJ/+PDV86vDRgbdeEjp8OOytt4T+t/s4dFnkrTekzkh7eukbUmeMNz76ekXqC2gn563HC1rHm95H32j0DE4BeuhDptHx4c5DF9Ijgg4POB56q9XhV95db4RPijq4//bQxZ2AlJsAb95ZF29d1sEn76xLySQ5J4VtaVx1ORUs69jxjaO+ltM5Si4SOvxw1EMZU/OwyAmAm67mL1Ud6Xhuupq/JPLvwK7GSSfS/1Ttgb3fL/OXgoMc06nSB0rP56y1ecSNOnMhqz7mrDN6BJk7pett0PEej450NLVGrAQfEJqcta7Oyr+u7zV0NX7aGrM5eW2Bob6+br7G1zS7UV9087x4N6XSBNIXvV9B6XfUpqpaY01pxtjaaaIxVjRb6mnZhyJSLM2Xt9USt2jVFRWVpZjXXkcdgbkWIkJzKgHR753Pra72E/gRAVQ/v+NXOtaG94yp34ceXo3poB9gXPT72IOnDxp6QvPRx98vIAvOONRWDnvp9/7fFhdTacg2LlprP3fWx+h3SUV9g2113jF/q+P4O6mo3ZdFUw/jNHQb6iYp97x79tJni7f+f+r/APpOPCx4fbjPAAAAAElFTkSuQmCC"
          alt=""
        />
      </Link>
      
      <Box sx={{ flexGrow: 1, maxWidth: '20%',  padding: 0, margin: 0, }}>
      <AppBar position="relative" style={{backgroundColor: '#c3dfff', border: '1px solid black', borderRadius: '5px'}}>
        <Toolbar sx={{ margin: '2%', }}>
          <form>
            <Typography component={'span'} variant="h6" sx={{color: 'black'}}>Search</Typography>
            <TextareaAutosize
              id='search-button'
              style={{ resize: 'none', padding: '2px' }}
              value={searchText}
              onChange={(e) => {searchInputChange(e.target.value);}}
              onKeyDown={handleEnterKeyDown}
            />
            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handleCloseMenu}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            >
              <List >
                {searchResults && searchResults.map((user) => (
                  <ListItem key={user._id}
                  onClick={e => { e.stopPropagation()}}
                  style={{cursor: 'pointer'}}
                  className='search-user'>
                    <ListItemText
                      // primary={`${user.firstName} ${user.lastName}`}
                      primary={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {user.profileData && <img
                          src={user.profileData.profilePicture}
                          alt="Profile Icon"
                          style={{ borderRadius: '50%', marginRight: '10px', width: '30px', height: '30px' }}
                        /> }
                        <span>{`${user.firstName} ${user.lastName}`}</span>
                      </div>
                      }
                      
                      onClick={() => displayUser(user._id, user, )}
                    />
                  </ListItem>
                ))}
              </List>
            </Popover>
          </form>
        </Toolbar>
      </AppBar>
    </Box>
    </Container>
  )
}

export default SearchBar
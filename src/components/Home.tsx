import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
//material ui
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function Home() {

    const [numSpace, setNumSpace] = useState("");

    const navigate = useNavigate();

    const handleChange = (e: any) => {
        setNumSpace(e.target.value);
    }
    const handleSubmit = () => {
        navigate('/ParkingSpace', { state: { numSpace } });
    }

    return (
        <div>
            <h1 data-testid="home-heading">Parking App</h1>
            No of Space <br /><br />
            <TextField id="parking-create-text-input" label="No of space" variant="outlined" type="number" value={numSpace} onChange={handleChange} /><br /><br />
            <Button variant="contained" id="parking-create-submit-button" data-testid="submit-btn" onClick={handleSubmit}>Submit</Button>

        </div>
    );
}

export default Home;


import { useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
//material-ui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

//toast
import Swal from 'sweetalert2';

//style for model
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ParkingSpace = () => {
    const location = useLocation();

    const [space, setSpace] = useState<any>();
    const [allocateParkNo, setAllocateParkNo] = useState<any>([{}]);

    //Registration of car for Parking (Parking allocation) 
    const [open, setOpen] = useState(false);
    const [carNo, setCarNo] = useState<string>();
    const [parkTime, setParkTime] = useState<any>();
    const [randomNum, setRandomNum] = useState<any>(0);
    const [regTimeInSec, setRegTimeInSec] = useState<any>(0);

    //Exit Car from parking
    const [openTwo, setOpenTwo] = useState(false);
    const [parkingCharge, setParkingCharge] = useState<string>();
    const [exitNo, setExitNo] = useState<any>();

    //parking slot number that user enter
    useEffect(() => {
        setSpace(location.state);
    }, [])

    // space allocation
    const spaceAllocateNumber = () => {
        const spaceAllocate = [];
        let spaceNo = Number(space?.numSpace);
        for (let space = 1; space <= spaceNo; space++) {
            spaceAllocate.push(space);
        }
        return spaceAllocate;
    };

    //Registration of car for Parking (Parking allocation)
    const handleRegistration = () => {
        setCarNo("");
        setOpen(true);

        let today = new Date();
        let hours = (today.getHours() < 10 ? '0' : '') + today.getHours();
        let minutes = (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();
        let seconds = (today.getSeconds() < 10 ? '0' : '') + today.getSeconds();
        let curTime = hours + ':' + minutes + ':' + seconds;

        setParkTime(curTime)
        const todaySec = new Date(),
            timeInSec = todaySec.getHours() * 3600 + todaySec.getMinutes() * 60 + todaySec.getSeconds();
        setRegTimeInSec(timeInSec);
    }
    const handleClose = () => {
        setOpen(false);
        setCarNo("");
        setParkTime("")
    }
    const handleCarNo = (e: any) => {
        setCarNo(e.target.value)
    }

    //random no generation 
    const generateRandom = () => {

        let allNum = spaceAllocateNumber();
        let num: number, randomNo: any;

        allocateParkNo.map((ele: any) => {
            if (allNum.indexOf(Number(ele?.randomNo)) > -1) {
                allNum.splice(allNum.indexOf(Number(ele?.randomNo)), 1);
            }
        })
        num = allNum[Math.floor(Math.random() * allNum.length)];

        randomNo = num;
        randomNo && setAllocateParkNo([...allocateParkNo, { "carNum": carNo, "randomNo": randomNo }])
        setRandomNum(randomNo);
    }

    const registerCar = () => {
        setOpen(false);
        allocateParkNo.length > 0 && allocateParkNo.length <= Number(space?.numSpace) ? generateRandom() : Swal.fire('Parking Slot full')
    }

    //Exit Car from parking
    const handleExit = (index: any) => {
        setOpenTwo(true);
        setExitNo(index);
        const today = new Date(),
            curTime = today.getHours() * 3600 + today.getMinutes() * 60 + today.getSeconds();

        const parkHour = Number(curTime) - Number(regTimeInSec); // Parking time calulated using diffence between car exit time(sec) and arrived time.
        const hours = Math.floor(parkHour / 3600); // get hours
        let parkCharge: number = hours <= 2 ? 10 : (hours * 10) - 10;

        setParkingCharge(parkCharge.toString())
    }

    const handleCloseTwo = () => {
        setOpenTwo(false);
    }
    const handlePayment = () => {
        let num;
        allocateParkNo.map((ele: any, index: number) => {
            if (Number(ele?.randomNo) === Number(exitNo)) {
                num = ele.carNum;
                allocateParkNo.splice(index, 1);
            }
        })
        const data = { "car-registration": num, "charge": parkingCharge }

        Swal.fire("Car Registration", JSON.stringify(data))

        // body send api
        fetch("https://httpstat.us/200", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => {
            console.log(data);
        });
        setOpenTwo(false);
    }


    //rendring data
    return <div>
        <h1 data-testid="park-heading">Parking Space</h1>
        <Button variant="contained" id="parking-drawing-add-car" data-testid="reg-btn" onClick={handleRegistration} >Car registration</Button>

        <Box sx={{ width: '100%', m: 2 }}>
            <Grid container spacing={3} >

                {/* Parking Spaces available */}
                {spaceAllocateNumber().map((ele: any) => {
                    return <Grid item xs={4} key={ele} >
                        <Card sx={{ height: "100%" }} key={ele} >
                            <CardContent>
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                    Car Parking
                                </Typography>
                                <Typography id={`parking-drawing-space-number-${ele}`} variant="h5" component="div" color="blue" sx={{ my: 1 }}>
                                    Parking No :  {ele}
                                </Typography>
                                {
                                    allocateParkNo.length > 0 && allocateParkNo.map((spAlocate: any, index: number) => {
                                        if (Number(spAlocate.randomNo) === Number(ele)) {
                                            return <Typography variant="h6" sx={{ my: 2 }} id={`parking-drawing-registered-${ele}`} color="green" key={ele} >
                                                {`Allocated`}<br />
                                                {`Car No : ${spAlocate?.carNum} `}<br />
                                                <Button id="deregister-time-spent" variant="contained" size="small" data-testid="ex-btn" onClick={() => handleExit(ele)}>Exit Car</Button>
                                            </Typography>
                                        }
                                    })
                                }
                            </CardContent>
                        </Card>
                    </Grid>
                })
                }
            </Grid>
        </Box>

        {/* Registration of car for Parking (Parking allocation) */}
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography variant="h4" component="div" sx={{ mb: 4 }}>
                    Car Registration
                </Typography>
                <Typography variant="h6" component="div" sx={{ mt: 2 }}>
                    Car Number  <TextField variant="outlined" id="parking-drawing-registration-input" value={carNo} onChange={handleCarNo} />
                </Typography>
                <Typography id="deregister-time-spent" variant="h6" component="div" sx={{ mt: 2 }}>
                    Parking Time : {parkTime}
                </Typography>
                <Typography variant="h5" component="div" sx={{ mt: 2 }}>
                    <Button id="parking-drawing-add-car-button" variant="contained" onClick={registerCar}> Register Car</Button>
                </Typography>
            </Box>
        </Modal>

        {/* Exit Car from parking */}
        <Modal
            open={openTwo}
            onClose={handleCloseTwo}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography variant="h4" component="div" sx={{ mb: 4 }}>
                    Parking Charges
                </Typography>
                <Typography id="deregister-charge" variant="h5" component="div" sx={{ mb: 4 }}>
                    $ {parkingCharge}
                </Typography>
                <Typography variant="h5" component="div" sx={{ mt: 2 }}>
                    <Button id="deregister-payment-button" variant="contained" onClick={handlePayment} sx={{ mx: 2 }}>Payment taken</Button>
                    <Button id="deregister-back-button" variant="contained" onClick={handleCloseTwo}>Back</Button>
                </Typography>
            </Box>
        </Modal>
    </div>;
}
export default ParkingSpace;
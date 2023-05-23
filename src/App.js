// the given project was i almost done but the edit will not work other thing it should be work
// you can create a multible event at the same time you can see in agenda also 
import { Calender } from "./Calender";
import "./styles.css";
import { Button,TextField} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Routes, Route, useNavigate} from "react-router-dom";
import './App.css'
import { useState} from "react";
import { MOCKAPPS } from "./conts";
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from "@mui/material";
import { useFormik } from 'formik';
import * as yup from 'yup';

const movieValidationShema = yup.object({
  date: yup.string().required(),
  tittle: yup.string().required().min(2),
  startTime: yup.string().required(),
  endTime: yup.string().required(),
})
export default function App() {
    const navigate=useNavigate()
  return (
    <div className="App">
      <AppBar position="static">
      <Toolbar>
      <Button color="inherit" onClick={() => navigate("/")}>HOME</Button>
      <Button color="inherit" onClick={() => navigate("/calender")}>CALENDER</Button>
      <Button color="inherit" onClick={() => navigate("/agenda")}>AGENDA</Button>
      </Toolbar>
    </AppBar>
    <Routes>
      <Route  path="/" element={<Home/>}></Route>
      <Route path='/calender' element={<Calender/>}></Route>
      <Route path='/agenda' element={<Agenta MOCKAPPS={MOCKAPPS}/>}></Route>
      <Route  path="/edit/:id" element={<Edit/>}></Route>

    </Routes>
    </div>
  );
}
function Home(){
    return(
      <div className='home'>
    
      </div>
    )
  }
  function Agenta({MOCKAPPS}){
    const navigate=useNavigate();
return(
    <div>
        <h1 className="agenda_head">Agenda</h1>
    <div className="table">
     <table singleLine >
        <thead >
          <tr >
          <th> No.</th>
            <th> Event</th>
            <th>Date</th>
            <th>StartTime</th>
            <th>EndTime</th>
          </tr>
        </thead>
        <tbody>
          {
            MOCKAPPS.map((data,id)=> (
              <tr key={id}>
                <td>{id}</td>
                 <td>{data.title}</td>
                 <td>{(data.date).toDateString()}</td>
                <td>{data.startTime} </td>
                <td>{data.endTime}</td>
                <td><IconButton onClick={()=>navigate(`/edit/${id}`)} ><EditIcon /></IconButton></td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
    </div>
)
  }

  function Edit(){
    const[details,setDetails]=useState(MOCKAPPS);
    const navigate=useNavigate()
    const updateUser = (update)=>{
      const ob_date=update.date
      const up_date=new Date(ob_date)
      console.log(typeof up_date)
      const updatedObject = Object.assign({},{date: up_date,title:update.tittle,startTime:update.startTime,endTime:update.endTime})
      //  MOCKAPPS.push(update)
      console.log(updatedObject)
      setDetails(updatedObject)
      console.log(details);
      navigate("/agenda")
     
    };
    
    const { handleSubmit, values, handleChange, handleBlur, touched, errors } =
    useFormik({
      initialValues: {
        date: details.date,
        tittle: details.tittle,
        startTime: details.startTime,
        endTime: details.endTime,        
      },
      validationSchema: movieValidationShema,
      onSubmit: (update) => {
         console.log("Form values:", update);
        updateUser(update);
      },
    });
    return(
      
         <form onSubmit={handleSubmit} className='add-movie-form'>    
      <TextField
        label="date"
        variant='outlined'
        name="date"
        value={values.date}
        onChange={handleChange}onBlur={handleBlur}
      />
      {touched.date && errors.date ? errors.date : null}
      <TextField
        label="tittle"
        variant='outlined'
        name="tittle"
        value={values.tittle}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {touched.tittle && errors.tittle ? errors.tittle : null}

      <TextField
        label="startTime"
        variant='outlined'
        name="startTime"
        value={values.startTime}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {touched.startTime && errors.startTime ? errors.startTime : null}

      <TextField
        label="endTime"
        variant='outlined'
        name="endTime"
        value={values.endTime}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {touched.endTime && errors.endTime ? errors.endTime : null}
      
      <Button type="submit" variant='contained'onClick={updateUser}>Update Event</Button>
    </form>
    )
  }
import { useEffect, useState } from "react";
import axios from "axios";

const initialForm = {
  name: "",
  course: "",
  age: ""
}

function App() {

  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [isEditing, setisEditing] = useState(false);
  const [editForm, setEditForm] = useState();
  const [editingId, setEditingId] = useState();

  useEffect(() => {
    axios
    .get("http://localhost:5000/students")
    .then((response) => {
      setStudents(response.data);
    });
    
  },[]);

  const handleChange = (e) => {
    setForm({
      ...form, [e.target.name]: e.target.value
    })
  }

  const handleChangeEdit = (e) => {
    setEditForm({
      ...editForm, [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      fetch("http://localhost:5000/students",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({...form, age: Number(form.age)})
      })
      setForm(initialForm)
      axios.get("http://localhost:5000/students")
      .then((response) => {
        setStudents(response.data);
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleEdit = (student) => {
    setEditingId(student._id)
    setEditForm(student)
  }

  const handleSubmitEdit = async (e) => {
    try{
        
        const response = await fetch(`http://localhost:5000/students/${editingId}`,{
          method: "PUT",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({...editForm, age: Number(editForm.age)})
        })
        const updated = await response.json()
        setStudents(students.map((s) => s._id === updated._id ? updated : s))
        setEditingId(null)
    }
    catch (error) {
        console.log(error)
    }
  }

  const handleDelete = async (id) => {
    fetch (`http://localhost:5000/students/${id}`, {
      method: "DELETE"
  })
  const remaining = students.filter((s) => s._id !== id)
  setStudents(remaining)
  }
  
  return (
    <div>
      <h1>Student Management System</h1>
      <h2>Add Student</h2>

      <form onSubmit = {handleSubmit}>
        <label>Name: </label>
        <input type ="text" required name="name" value = {form.name} 
        placeholder="Enter Your Name" 
        onChange={handleChange}></input>
        <br></br> <h2></h2>

        <label>Course: </label>
        <input type ="text" required name="course" value= {form.course} 
        placeholder="Enter Your Course" 
        onChange={handleChange}></input>
        <br></br> <h2></h2>

        <label>Age: </label>
        <input type ="number" name="age" value= {form.age} 
        placeholder="Enter Your Age" 
        onChange={handleChange}></input>
        <br></br> <h2></h2>

        <button type = "submit">Add Student</button>

      </form> <h2></h2>

      <h2>Students</h2>

      {students.map((student) => editingId === student._id ? (
        <div key = {student._id}>
          <label>Name: </label>
          <input type="text" name="name" value={editForm.name} onChange={handleChangeEdit}></input> 
          <label>Course: </label>
          <input type="text" name="course" value={editForm.course} onChange={handleChangeEdit}></input>
          <label>Age: </label>
          <input type="number" name="age" value={editForm.age} onChange={handleChangeEdit}></input>
          <button onClick={handleSubmitEdit}>Save</button>
          <button onClick ={() => setEditingId(null)}>Cancel</button>
          </div>
      ) : ( 
      <div key={student._id}>
          <p>Name: {student.name}</p>
          <p>Course: {student.course}</p>
          <p>Age: {student.age}</p>
          <button onClick={() => handleEdit(student)}>Edit</button>
          <button onClick={() => handleDelete(student._id)}>Delete</button> 
          </div>   
    ))}

    </div>
  );
}

export default App;


import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container, Stack, Dropdown, DropdownButton } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRef, useState, useEffect } from 'react';

function ContactList(contacts) {

  const [dataList, setDataList] = useState([])
  const [addHidden, setAddHidden] = useState(true)
  const [showText,setShowText] = useState("Add Contact")
  const [refresh,setRefresh]= useState(true)


  useEffect(() => {
    setDataList(contacts.contacts)


  }, [])

  useEffect(() => {
    console.log(dataList,"efffettt")

  }, [dataList,])


  // To reset form
  const resetForm = () => {
    document.getElementById("contact-form").reset();
  }


  // To delete conatact
  const deleteContact = async (e) => {
    fetch(`https://jsonplaceholder.typicode.com/users/${e.target.id}`, {
      method: 'DELETE',
    });

    const objs = dataList.filter((element) => {
      if (+e.target.id !== element.id) {
        return element
      }
    })

    setDataList(objs)

    toast.success(`Contact(id(${e.target.id})) deleted sucessfully!`, {
      position: toast.POSITION.TOP_RIGHT
    });
  }




  // Update contact API Call
  const UpdateData = async(data)=>{
    const id = toast.loading("Please wait...")
      const response = fetch(`https://jsonplaceholder.typicode.com/todos/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })

      const result = await response
      const final = await result.json()

      if (final) {
        toast.update(id, { render: `Contact(${final.id}) updated sucessfully!`, type: "success", isLoading: false, autoClose: 3000 });
      } else {
        toast.update(id, { render: "Something went wrong", type: "error", isLoading: false, autoClose: 3000 });
      }

  }


  // To uodate contact
  const updateContact = async (e) => {
    const objs = dataList.filter((element) => {
      if (+e.target.id === element.id) {
        return element
      }
    })

    let obj = objs[0];
    const data = document.getElementsByClassName(e.target.id)

    for (let i = 0; i < data.length; i++) {
      if (data[i].id == "name") {
        obj.name = data[i].innerHTML
      } else if (data[i].id == "username") {
        obj.username = data[i].innerHTML

      } else if (data[i].id == "email") {
        obj.email = data[i].email
      } else if (data[i].id == "address") {
        let address = data[i].querySelectorAll("p")
        let streetDetail = {};
        let geo = {};
        for (let j = 0; j < address.length; j++) {
          let temp = address[j].innerText.split(":")
          if (temp[0] == "lat" || temp[0] == "lng") {
            geo[temp[0]] = temp[1]
          } else {
            streetDetail[temp[0]] = temp[1]

          }

        }
        obj.address = streetDetail
        obj.address.geo = geo
      } else if (data[i].id == "company") {
        let company = data[i].querySelectorAll("p")
        let companyDetail = {}
        for (let k = 0; k < company.length; k++) {
          let temp = company[k].innerText.split(":")
          companyDetail[temp[0]] = temp[1]

        }

      }

    }  

    await UpdateData(obj)
 
  
  }




  // Add contact API call
  const addContact = async(data)=>{
    const id = toast.loading("Please wait...")
      const response = fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })

      const result = await response
      const final = await result.json()

      if (final) {
        toast.update(id, { render: `${final.name} - cantact added sucessfully!`, type: "success", isLoading: false, autoClose: 3000 });
      } else {
        toast.update(id, { render: "Something went wrong", type: "error", isLoading: false, autoClose: 3000 });
      }

      return final

  }

  // Add contact
  const handleSubmit = async(e) => {
    e.preventDefault();
    
    let data={
      "name": e.target.name.value,
      "username": e.target.username.value,
      "email":e.target.email.value,
      "address": {
          "street": e.target.street.value,
          "suite": e.target.suite.value,
          "city": e.target.city.value,
          "zipcode": e.target.zipcode.value,
          "geo": {
              "lat": e.target.lat.value,
              "lng": e.target.lng.value
          }
      },
      "phone": e.target.phone.value,
      "website": e.target.website.value,
      "company": {
          "name": e.target.companyname.value,
          "catchPhrase": e.target.catchPhrase.value,
          "bs": e.target.bs.value
      }
  }
  
  
  dataList.sort(function(a, b) { 
    return a.id - b.id});
  let last = dataList[dataList.length -1]

  data.id = last.id +1

  dataList.push(data)
  setDataList(dataList)
  await addContact(data)
  document.getElementById("contact-form").reset();
  setRefresh(!refresh)
  
  }

// Hide and unhide Add form
  const onClickAddContact = ()=>{
    if (addHidden ==true){
      setShowText("Hide Form")
    } else{
      setShowText("Add Contact")
    }
    setAddHidden(!addHidden)
  }


  return (
    <div >
      <div className='d-flex' >
        <h3 >ContactList</h3>
        <Button style={{ marginLeft: "80%" }} onClick={onClickAddContact }>{showText}</Button>
      </div>
      <Stack direction="vertical" gap={3} style={{ padding: "10px" }} hidden={addHidden}>
        <form onSubmit={handleSubmit} id="contact-form">
          <h4>Basic Info</h4>
          <input name="name" placeholder='Name' style={{marginRight:"20px"}} required></input>
          <input name="username" placeholder='UserName' style={{marginRight:"20px"}} required></input>
          <input name="email" placeholder='Email' style={{marginRight:"20px"}} required></input>
          <div>
            <h4>Address</h4>
            <div>
              <input name="street" placeholder='Street' style={{marginRight:"20px"}}></input>
              <input name="suite" placeholder='Suite' style={{marginRight:"20px"}}></input>
              <input name="city" placeholder='City' style={{marginRight:"20px"}}></input>
              <input name="zipcode" placeholder='Zipcode' style={{marginRight:"20px"}}></input>
            </div>
            <br></br>
            <div>
              <input name="lat" placeholder='lat' style={{marginRight:"20px"}}></input>
              <input name="lng" placeholder='lng' style={{marginRight:"20px"}}></input>
            </div>
          </div>
          <div>
            <h5>Contact</h5>
          <input name="phone" placeholder='catchPhrase' style={{marginRight:"20px"}}></input>
            <input name="website" placeholder='bs' style={{marginRight:"20px"}}></input>

          </div>
          <div >
            <h5>Company Details</h5>
            <input name="companyname" placeholder='Name' style={{marginRight:"20px"}}></input>
            <input name="catchPhrase" placeholder='catchPhrase' style={{marginRight:"20px"}}></input>
            <input name="bs" placeholder='bs' style={{marginRight:"20px"}}></input>

          </div>
          <br></br>
          <Button variant="outline-secondary" type="submit" style={{cursor:"pointer",marginRight:"10px"}}>Submit</Button>
          <Button variant="outline-danger" onClick={resetForm} style={{cursor:"pointer"}}>Reset</Button>

        </form>

      </Stack>

      <table className="table table-hover" >
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">UserName</th>
            <th scope="col">Email</th>
            <th scope="col">Address Detail</th>
            <th scope="col">Phone</th>
            <th scope="col">Website</th>
            <th scope="col">Company</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody >

          {dataList && dataList.map((item, i) => (

            <tr>
              <th scope="row">{item.id}</th>
              <td contentEditable={true} className={`${item.id}`} id="name">{item.name}</td>
              <td contentEditable={true} className={`${item.id}`} id="username">{item.username}</td>
              <td contentEditable={true} className={`${item.id}`} id="email">{item.email}</td>
              <td className={`${item.id} w-50`} id="address" >
                <h5>Address</h5>
                <p contentEditable={true}> <span contentEditable={false}>street:</span>{item.address.street}</p>
                <p contentEditable={true}> <span contentEditable={false}>suite:</span>{item.address.suite}</p>
                <p contentEditable={true}> <span contentEditable={false}>city:</span>{item.address.city}</p>
                <p contentEditable={true}> <span contentEditable={false}>zipcode:</span>{item.address.zipcode}</p>
                <h5>Geo</h5>
                <p contentEditable={true}> <span contentEditable={false}>lat:</span>{item.address.geo?.lat}</p>
                <p contentEditable={true}> <span contentEditable={false}>lng:</span>{item.address.geo?.lng}</p>

              </td>

              <td contentEditable={true} className={`${item.id}`} id="phone">{item.phone}</td>
              <td contentEditable={true} className={`${item.id}`} id="website">{item.website}</td>


              <td className={`${item.id} w-50`} id="company">
                <p contentEditable={true}> <span contentEditable={false}>Name:</span>{item.company.name}</p>
                <p contentEditable={true}> <span contentEditable={false}>catchPhrase:</span>{item.company.catchPhrase}</p>
                <p contentEditable={true}> <span contentEditable={false}>bs:</span>{item.company.bs}</p>
              </td>
              <td>
                <div className='d-flex'>

                  <Button variant="secondary" style={{ marginLeft: "5px" }} id={item.id} onClick={updateContact}>Update</Button>
                  <Button variant="danger" style={{ marginLeft: "5px" }} id={item.id} onClick={deleteContact}>Delete</Button>
                </div>

              </td>

            </tr>

          ))}
        </tbody>

      </table>

      <ToastContainer />

    </div>
  );
}

export default ContactList;

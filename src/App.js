import { useState, useEffect } from "react";
import ContactList from "./ContactList"
import 'bootstrap/dist/css/bootstrap.css';

function App() {

  // To store contacts
  const [contacts, setContacts] = useState();

  // fetching Contact list
  const fetchContact = async () => {
    const response = fetch("https://jsonplaceholder.typicode.com/users")

    const result = await response
    const final = await result.json()

    setContacts(final)

  }

  useEffect(() => {
    fetchContact()


  }, [])


  return (
    <div className="App">
      {/* rendering ContactList component */}
      {contacts && <ContactList contacts={contacts} />}
    </div>
  );
}

export default App;

import React, { useState, useRef } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { AiOutlineSend } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { FiLogOut } from 'react-icons/fi';
import { FaHome } from 'react-icons/fa';

firebase.initializeApp({
  apiKey: "AIzaSyADkSgH33XhJiYAhMUD_OH7k5W7LBNiCLw",
  authDomain: "chatapp-fe55f.firebaseapp.com",
  projectId: "chatapp-fe55f",
  storageBucket: "chatapp-fe55f.appspot.com",
  messagingSenderId: "578748164047",
  appId: "1:578748164047:web:90981b0512cd0e9d1f94ba",
  measurementId: "G-DG0JPSB1JM"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
      <button id="homeButton">Return &nbsp; <FaHome size={25}/></button>
        <SignOut />
      </header>

      <section id="appBody">
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
    <button id="sign-in" onClick={signInWithGoogle}>Sign in with Google &nbsp; <FcGoogle/></button>
    </>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button id="logOut" onClick={() => auth.signOut()}>Sign Out &nbsp; <FiLogOut/></button>
  )
}

function ChatRoom() {

  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(50);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {

    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');

    dummy.current.scrollIntoView({ behavior: 'smooth'})
  }

  return (
    <>
    <div>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
    </div>

    <span ref={dummy}></span>

    <form onSubmit={sendMessage}>

      <input id="commentField" value={formValue} placeholder="Type here" onChange={(e) => setFormValue(e.target.value)}/>

      <button id="sendComment" type="submit"><AiOutlineSend /></button>
    </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
  <div className={`message ${messageClass}`}>
    <img alt="profilepicture" src={photoURL} />
     <p>{text}</p>
     </div>
  </>)
}

export default App;

import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase';
import { connectData } from './../../components/FIrebase/firebaseConnect';


function User(props) {
  const [data,setData] = useState([])
  useEffect(() => {
    connectData.on('value',(notes) =>{
      var arrayData = [];
      notes.forEach(element => {
         const noteTitle = element.val().title;
         const noteContent = element.val().content;
         arrayData.push({
           noteTitle : noteTitle,
           noteContent : noteContent
         })
      });
      setData(arrayData)
  })
},[])
console.log("111111",data)
  return (
    <div>
      aaaaa
    </div>
  );
}

export default User;
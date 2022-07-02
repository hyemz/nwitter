import React, { useEffect, useState } from 'react';
import { authService, dbService } from 'fbase';
import { updateProfile } from 'firebase/auth';

import { useNavigate } from 'react-router-dom';
import { collection, where, query, getDocs } from 'firebase/firestore';

export default ({ userObj, userObjs, refreshUser }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObjs.displayName);
  const navigate = useNavigate();
  const onLogOutClick = () => {
    authService.signOut();
    navigate('/');
  };
  const getMyNweets = async () => {
    const nweets = await query(
      collection(dbService, 'nweets'),
      where('creatorId', '==', userObj) // 필터링 하는 방법..
    );
    const querySnapshot = await getDocs(nweets);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, ' => ', doc.data());
    });
  };
  useEffect(() => {
    getMyNweets();
  }, []);
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObjs.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      })
        .then(() => {
          console.log('성공');
          refreshUser();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          onChange={onChange}
          value={newDisplayName}
          placeholder="Display Name"
        ></input>
        <input type="submit" value="Update Profile"></input>
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

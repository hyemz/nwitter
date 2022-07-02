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
      //doc.id, ' => ', doc.data());
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
          // console.log('성공');
          refreshUser();
        })
        .catch((error) => {
          //console.log(error);
        });
    }
  };
  return (
    <div className="container">
      <>
        <form onSubmit={onSubmit} className="profileForm">
          <input
            type="text"
            autoFocus
            onChange={onChange}
            value={newDisplayName}
            placeholder="Display Name"
            className="formInput"
          ></input>
          <input
            type="submit"
            value="Update Profile"
            className="formBtn"
            style={{
              marginTop: 10,
            }}
          ></input>
        </form>
        <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
          Log Out
        </span>
      </>
    </div>
  );
};

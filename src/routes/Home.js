import { dbService } from 'fbase';
import React, { useEffect, useState } from 'react';
import { collection, orderBy, onSnapshot, query } from 'firebase/firestore';

import Nweet from 'components/Nweet';
import NweetFactory from 'components/NweetFactory';

const Home = (userObj) => {
  const [nweets, setNweets] = useState([]);
  useEffect(() => {
    const q = query(
      collection(dbService, 'nweets'),
      orderBy('createdAt', 'desc')
    );
    onSnapshot(q, (snapshot) => {
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArray);
    });
  }, []);

  return (
    <div className="container">
      <NweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {nweets.map((n) => (
          <Nweet
            key={n.id}
            nweetObj={n}
            isOwner={n.creatorId === userObj.userObj}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;

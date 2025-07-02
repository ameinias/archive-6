
import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { db } from '../../utils/db'; // import the database
import { useLiveQuery } from 'dexie-react-hooks';

export function FriendList() {
  const friends = useLiveQuery(() => db.friends.toArray());

  return (
    <ul>
      {friends?.map((friend) => (
        <li key={friend.id}>
          {friend.id} : {friend.title}, {friend.description}
        </li>
      ))}
    </ul>
  );
}
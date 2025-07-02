import { FriendList } from './Friends/FriendList';
import { AddFriendForm } from './Friends/AddFriend';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';

const UserProfile = () => {


    return (
          <>
    <h1>My simple Dexie app</h1>

      <Link to="/">
    <Button variant="outline-primary">Go to Home</Button>
    </Link>

    <h2>Add Friend</h2>
    <AddFriendForm defaultCat={'Object'} />

    <h2>Friend List</h2>
    <FriendList />
  </>
    )

}

export default UserProfile
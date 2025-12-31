import React, { useRef, useState } from "react";
import LinkParser from "react-link-parser";
import { useLiveQuery } from "dexie-react-hooks";
import { Link } from "react-router-dom";
import { db, dbHelpers } from "@utils/db";

export const DescriptionEntry = ({ string, className = "default" }) => {
  const allFriends = useLiveQuery(() => db.friends.toArray(), []);
  const allSubs = useLiveQuery(() => db.subentries.toArray(), []);

  const getEntryTitle = (entryId) => {
    if (!allFriends) return entryId;
    const entry = allFriends.find((f) => f.id === Number(entryId));
    return entry?.fauxID || entryId;
  };

  const getSubentryTitle = (entryId) => {
    if (!allSubs) return entryId;
    const entry = allSubs.find((f) => f.id === Number(entryId));
    return entry?.fauxID || entryId;
  };

  const getParentID = (entryId) => {
    if (!allSubs) return entryId;
    const entry = allSubs.find((f) => f.id === Number(entryId));
    return entry?.parentID || entryId;
  };

  // Allows parsing of links and mentions
  //https://github.com/amir2mi/react-link-parser
  const watchers = [
    // {
    //   type: "startsWith",
    //   watchFor: "#",
    //   render: (tag) => <Link to={`/entry/${tag}`} title="the entry">{tag} this link</Link>,
    //  },
        {
      type: "startsWith",
      watchFor: "###",
      render: (mention) => {
        const entryId = mention.substring(3);
        
        const title = getSubentryTitle(entryId);
        console.log(entryId + " " +  title);
        return (
          <>
            <Link
              to={`/entry/${getParentID(entryId)}`}
              title={`View entry ${title}`}
              className="mention-link" 
            >
              #{title}
            </Link>{" "}
          </>
        );
      },
    },
    {
      type: "startsWith",
      watchFor: "##",
      render: (mention) => {
        const entryId = mention.substring(2);
        const title = getEntryTitle(entryId);
        console.log(entryId + " " +  title);
        return (
          <>
            <Link
              to={`/entry/${entryId}`}
              title={`View entry ${title}`}
              className="mention-link"
            >
              #{title}
            </Link>{" "}
          </>
        );
      },
    },

    // {
    //   type: "endsWith",
    //   watchFor: "*",
    //   render: (text) => <span style={{ color: "red" }}>{text}</span>,
    // },
    {
      watchFor: "link",
      render: (url) => (
        <a href={url} target="_blank" rel="noreferrer noopener nofollow">
          {url}
        </a>
      ),
    },
    // {
    //   watchFor: "email",
    //   render: (url: string) => (
    //     <a href={`mailto:${url}`} target="_blank" rel="noreferrer noopener">
    //       {url.replace("@", "[at]")}
    //     </a>
    //   ),
    // },
  ];

  return (
    <div className={`description ${className}`}>
      <LinkParser watchers={watchers}>{string}</LinkParser>
    </div>
  );
};

export default DescriptionEntry;

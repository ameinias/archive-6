import React from "react";

export function EntryHeader({ item, type = "Entry" }) {
  return (
    <div className="row">
      <div className="entry-header">
        <div className="entry-title">
          <span className="parentIDSpan">{item.fauxID}</span>
          <span className="parentTitleSpan">{item.title}</span>
        </div>
      </div>
    </div>
  );
}

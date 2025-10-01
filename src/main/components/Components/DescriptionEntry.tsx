import React, { useRef, useState } from 'react';
import Quill, { Delta } from 'quill';
import Editor from './Editor'

// const Delta = Quill.import('delta');


const DescriptionEntry(){
  const [range, setRange] = useState();
  const [lastChange, setLastChange] = useState();
  const [readOnly, setReadOnly] = useState(false);

  // Use a ref to access the quill instance directly
  const quillRef = useRef();
  const quill = new Quill('#editor');

  return (
    <div>
      <Editor
        ref={quill}
        readOnly={readOnly}
        defaultValue={new Delta()
          .insert('Hello')
          .insert('\n', { header: 1 })
          .insert('Some ')
          .insert('initial', { bold: true })
          .insert(' ')
          .insert('content', { underline: true })
          .insert('\n')}
        onSelectionChange={setRange}
        onTextChange={setLastChange}
      />

      <div class="controls">
        <label>
          Read Only:{' '}
          <input
            type="checkbox"
            value={readOnly}
            onChange={(e) => setReadOnly(e.target.checked)}
          />
        </label>
    </div>
    </div>
  );
};

export default DescriptionEntry;

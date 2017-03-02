import {
  RichUtils,
  EditorState,
} from 'draft-js';

export default (editorState) => {
  const newEditorState = RichUtils.toggleLink(
    editorState,
    editorState.getSelection(),
    null,
  );
  return EditorState.forceSelection(
    newEditorState,
    editorState.getCurrentContent().getSelectionAfter()
  );
};

import getEntityKeyForSelection from 'draft-js/lib/getEntityKeyForSelection';

export default function selectionHasEntity(editorState) {
  const contentState = editorState.getCurrentContent();
  const targetSelection = editorState.getSelection();

  const entityKey = getEntityKeyForSelection(contentState, targetSelection);

  return !!entityKey;
};

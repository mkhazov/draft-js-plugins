import getEntityKeyForSelection from 'draft-js/lib/getEntityKeyForSelection';

export default function getEntityForSelection(editorState) {
  const contentState = editorState.getCurrentContent();
  const targetSelection = editorState.getSelection();

  const entityKey = getEntityKeyForSelection(contentState, targetSelection);

  return entityKey ? contentState.getEntity(entityKey) : undefined;
};

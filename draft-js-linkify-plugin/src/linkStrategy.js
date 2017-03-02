import { Entity } from 'draft-js';

function linkStrategy(contentBlock, cb, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      if (entityKey === null) {
        return;
      }

      const entity = contentState ? contentState.getEntity(entityKey) : Entity.get(entityKey);
      return entity.getType() === 'LINK';
    },
    cb
  );
}

export default linkStrategy;

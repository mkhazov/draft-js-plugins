import React, { Component } from 'react';
import unionClassNames from 'union-class-names';
import selectionHasEntity from '../utils/selectionHasEntity';

export default ({ children }) => (
  class linkButton extends Component {

    activate = (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.props.addLink();
    }

    preventBubblingUp = (event) => { event.preventDefault(); }

    styleIsActive = () => selectionHasEntity(this.props.getEditorState());

    render() {
      const { theme } = this.props;
      const className = this.styleIsActive() ? unionClassNames(theme.button, theme.active) : theme.button;
      return (
        <div
          className={theme.buttonWrapper}
          onMouseDown={this.preventBubblingUp}
        >
          <button
            className={className}
            onClick={this.activate}
            type="button"
            children={children}
          />
        </div>
      );
    }
  }
);

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import linkifyIt from 'linkify-it';
import getEntityForSelection from '../utils/getEntityForSelection';
import addLink from '../modifiers/addLink';
import removeLink from '../modifiers/removeLink';
import styles from '../linkAddStyles.css';

export default class LinkAdd extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    showAddButton: PropTypes.bool,
    showRemoveButton: PropTypes.bool,
  };

  static defaultProps = {
    placeholder: 'Paste the link url …',
    showAddButton: true,
    showRemoveButton: true,
  };

  // Start the popover closed
  state = {
    url: '',
    open: false,
    linkError: false,
    linkifySchema: {},
    linkifyOptions: {}
  };

  linkify = new linkifyIt(this.props.linkifySchema, this.props.linkifyOptions);

  // When the popover is open and users click anywhere on the page,
  // the popover should close
  componentDidMount() {
    document.addEventListener('click', this.closePopover);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closePopover);
  }

  onPopoverClick = () => {
    this.preventNextClose = true;
  }

  onKeyDown(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();
      this.addLink();
    }
  }

  setPosition = (toolbarElement) => {
    const position = {
      top: toolbarElement.offsetTop,
      left: toolbarElement.offsetLeft,
      width: toolbarElement.offsetWidth,
      transform: 'translate(-50%) scale(1)',
      transition: 'transform 0.15s cubic-bezier(.3,1.2,.2,1)',
    };
    this.setState({ position });
  }

  openPopover = () => {
    if (!this.state.open) {
      const entity = getEntityForSelection(this.props.editorState);
      let url = '';

      if (entity && entity.getData().url) {
        url = entity.getData().url;
      }

      this.setState({ url });

      this.preventNextClose = true;
      // eslint-disable-next-line react/no-find-dom-node
      const toolbarElement = ReactDOM.findDOMNode(this.props.inlineToolbarElement);
      this.setPosition(toolbarElement);
      setTimeout(() => {
        setTimeout(() => this.inputElement.focus(), 0);
        this.setState({ open: true, });
      }, 0);
    }
  };

  closePopover = () => {
    if (!this.preventNextClose && this.state.open) {
      this.setState({ open: false });
      this.setState({ url: '' });
    }

    this.preventNextClose = false;
  };

  addLink = () => {
    const { editorState, onChange } = this.props;
    const { url } = this.state;
    if (this.linkify.test(url)) {
      this.setState({ linkError: false });
      onChange(addLink(editorState, url));
      this.closePopover();
    } else {
      this.setState({ linkError: true });
    }
  };

  removeLink = () => {
    const { editorState, onChange } = this.props;
    onChange(removeLink(editorState));
    this.closePopover();
  };

  changeUrl = (evt) => {
    this.setState({ url: evt.target.value });
  }

  render() {
    const popoverClassName = this.state.open ?
      styles.addLinkPopover :
      styles.addLinkClosedPopover;

    const inputClassName = this.state.linkError ?
      `${styles.addLinkInput} ${styles.addLinkInputError}` :
      styles.addLinkInput;

    let inputWidth;
    if (this.props.showAddButton && this.props.showRemoveButton) { // 2 buttons
      inputWidth = '78%';
    } else if (!this.props.showAddButton && !this.props.showRemoveButton) { // no buttons
      inputWidth = '100%';
    } else { // 1 button
      inputWidth = '89%';
    }

    return (
      <div className={styles.addLink}>
        <div
          className={popoverClassName}
          onClick={this.onPopoverClick}
          style={this.state.position}
        >
          <input
            ref={(element) => { this.inputElement = element; }}
            type="text"
            placeholder={this.props.placeholder}
            className={inputClassName}
            style={{ width: inputWidth }}
            onChange={this.changeUrl}
            onKeyDown={(e) => this.onKeyDown(e)}
            value={this.state.url}
          />
          {
            this.props.showAddButton && (
              <button
                className={styles.addLinkConfirmButton}
                type="button"
                onClick={this.addLink}
              >
                +
              </button>
            )
          }
          {
            this.props.showRemoveButton && (
              <button
                className={styles.addLinkConfirmButton}
                type="button"
                onClick={this.removeLink}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 1L9 0 5 4 1 0 0 1l4 4-4 4 1 1 4-4 4 4 1-1-4-4" fillRule="evenodd" />
                </svg>
              </button>
            )
          }
        </div>
      </div>
    );
  }
}

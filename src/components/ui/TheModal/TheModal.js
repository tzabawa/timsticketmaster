import { Fragment } from 'react';
import { createPortal } from 'react-dom';

import classes from  './TheModal.module.css';

const ModalBackdrop = (props) => {
  return (
    <div className={classes.modal_backdrop} onClick={props.onModalBackdropClickHander}></div>
  );
};

const ModalOverlay = (props) => {
  return (
    <div className={classes.modal_overlay}>
      <div className={classes.modal_content}>
        {props.children}
      </div>
    </div>
  );
};

const portalElement = document.getElementById('overlays');

const TheModal = (props) => {
  return (
    <Fragment>
      {createPortal(<ModalBackdrop onModalBackdropClickHander={props.onModalBackdropClickHander}/>, portalElement)}
      {createPortal(<ModalOverlay>{props.children}</ModalOverlay>, portalElement)}
    </Fragment>
  );
}

export default TheModal;

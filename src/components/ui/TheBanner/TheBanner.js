import { Fragment } from 'react';
import classes from  './TheBanner.module.css';

function TheBanner(props) {
  return (
    <div className={classes.banner}>
      {(props.title && props.subTitle) && (
        <Fragment>
          <div className={classes.banner_title}>{props.title}</div>
          <div className={classes.banner_sub_title}>{props.subTitle}</div>
        </Fragment>
      )}
    </div>
  );
}

export default TheBanner;

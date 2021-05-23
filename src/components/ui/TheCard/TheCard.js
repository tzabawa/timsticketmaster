import classes from  './TheCard.module.css';

function TheCard(props) {
  return (
    <div className={classes.card}>
      {props.children}
    </div>
  );
}

export default TheCard;

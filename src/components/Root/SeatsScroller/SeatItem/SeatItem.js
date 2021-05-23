import { useState } from 'react';
import classes from './SeatItem.module.css';

function SeatItem(props) {
  const [hasBeenReserved, setHasBeenReserved] = useState(false);
  const onItemClickHandler = () => {
    setHasBeenReserved(true);
    props.onSeatItemClick();
  };

  return (
    <div className={(props.reserved) ? `${classes.seat_item} ${classes.reserved}` : `${classes.seat_item}`}>
      <div>
        <span className={classes.seat_price}>${props.price}</span>
        <button className={(hasBeenReserved) ? `${classes.reserve_button} ${classes.is_reserved}` :  `${classes.reserve_button}`} disabled={hasBeenReserved} onClick={onItemClickHandler}>{(hasBeenReserved) ? 'Reserved!' : 'Reserve Seat'}</button>
      </div>
      <h4>Row: {props.section}</h4>
      <h5>Seat: {props.seat}</h5>
    </div>
  );
}

export default SeatItem;

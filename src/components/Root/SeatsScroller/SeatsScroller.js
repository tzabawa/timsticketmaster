import { Fragment, useContext } from 'react';

import classes from './SeatsScroller.module.css';
import { MdEventSeat } from 'react-icons/md';

import TheCard from '../../ui/TheCard/TheCard.js';
import SeatItem from './SeatItem/SeatItem.js';

import ShowDetailsContext from '../../../store/show-details-context.js';


function SeatsScroller() {
  const {showDetails, updateShowDetails} = useContext(ShowDetailsContext);

  const onButtonClickHandler = (seat) => {
    updateShowDetails({type: 'UPDATE_CURRENT_RESERVATION', payload: showDetails.currentReservation.concat(seat)})
  };

  return (
    <div className={classes.seats_scroller}>
      {
        (showDetails.seats.length) ? (
          showDetails.seats.map((seat) => (
            <TheCard key={`${showDetails.performance.id}_${seat.levelId}_${seat.row}_${seat.seat}`}>
              <SeatItem price={seat.price} section={seat.row} seat={seat.seat} reserved={seat.reserved} onSeatItemClick={onButtonClickHandler.bind(this, seat)}/>
            </TheCard>
          ))
        ) : (
          <Fragment>
            <h4 className={classes.no_seats_instructions}>Please click on venue level to view the available seats!</h4>
            <div className={classes.seat_icon}>
              <MdEventSeat/>
            </div>
          </Fragment>
        )
      }
    </div>
  );
}

export default SeatsScroller;

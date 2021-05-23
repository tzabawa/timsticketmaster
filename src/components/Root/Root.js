
import { Fragment, useState, useReducer } from 'react';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';

import classes from './Root.module.css'

import TheModal from '../ui/TheModal/TheModal.js';
import TheHeader from '../ui/TheHeader/TheHeader.js';
import TheBanner from '../ui/TheBanner/TheBanner.js';

import VenueSectionGrid from './VenueSectionGrid/VenueSectionGrid.js';
import SeatsPanel from './SeatsPanel/SeatsPanel.js';
import ReservationSubmissionForm from './ReservationSubmissionForm/ReservationSubmissionForm.js';
import EventSearchForm from './EventSearchForm/EventSearchForm.js';

import ShowDetailsContext from '../../store/show-details-context.js';

function Root() {
  const [modalStatuses, setModalStatuses] = useState({searchShowModal: true, reservationSummaryModal: false});

  const initialEventState = {
    venue: null,
    show: null,
    performance: null,
    seats: [],
    currentReservation: [],
  };
  const eventReducer = (state, action) => {
    switch (action.type) {
      case 'UPDATE_VENUE':
        return { venue: action.payload, show: state.show, performance: state.performance,
          seats: state.seats, currentReservation: state.currentReservation};
      case 'UPDATE_SHOW':
        return { venue: state.venue, show: action.payload, performance: state.performance,
          seats: state.seats, currentReservation: state.currentReservation};
      case 'UPDATE_PERFORMANCE':
        return { venue: state.venue, show: state.show, performance: action.payload,
          seats: state.seats, currentReservation: state.currentReservation};
      case 'UPDATE_SEATS':
        return { venue: state.venue, show: state.show, performance: state.performance,
          seats: action.payload, currentReservation: state.currentReservation};
      case 'UPDATE_CURRENT_RESERVATION':
        return { venue: state.venue, show: state.show, performance: state.performance,
          seats: state.seats, currentReservation: action.payload};
      default:
       return initialEventState;
    }
  }
  const [event, dispatchEventUpdate] = useReducer(eventReducer, initialEventState);

  const onResetEventSearchHandler = () => {
    dispatchEventUpdate({});
    onModalStatusUpdateHandler({modal: 'searchShowModal', state: true});
  };
  const onModalStatusUpdateHandler = (params) => {
    setModalStatuses((prevState) => ({
      ...prevState,
      [params.modal]: params.state
    }));
  };

  const dateFormatter = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Fragment>
      <ShowDetailsContext.Provider value={{
        showDetails: event,
        updateShowDetails: dispatchEventUpdate
      }}>
        {(modalStatuses.searchShowModal && (
            <TheModal>
              <EventSearchForm onEventSearchFormSubmit={onModalStatusUpdateHandler.bind(this, {modal: 'searchShowModal', value: false})}/>
            </TheModal>
          )
        )}
        {(modalStatuses.reservationSummaryModal && (
            <TheModal onModalBackdropClickHander={onModalStatusUpdateHandler.bind(this, {modal: 'reservationSummaryModal', state: false})}>
              <ReservationSubmissionForm/>
            </TheModal>
          )
        )}
        <TheHeader title="Tim's Ticket Master">
          <div className={classes.header_action_icons}>
            <button onClick={onResetEventSearchHandler}>
              <FaSearch/>
            </button>
            <button onClick={onModalStatusUpdateHandler.bind(this, {modal: 'reservationSummaryModal', state: true})}>
              <FaShoppingCart/><span className={classes.reservations_amount_indicator}>{event.currentReservation.length}</span>
            </button>
          </div>
        </TheHeader>
        <TheBanner
          title={(event.venue && event.show) ? `${event.venue.name}- ${event.show.name}` : undefined}
          subTitle={(event.performance) ? dateFormatter(event.performance.showTime) : undefined}
        />
        <div className={classes.grid_container}>
          <div className="grid-item">
            <VenueSectionGrid/>
          </div>
          <div className="grid-item">
            <SeatsPanel/>
          </div>
        </div>
      </ShowDetailsContext.Provider>
    </Fragment>
  );
}

export default Root;

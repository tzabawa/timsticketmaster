import classes from './SeatsPanel.module.css';

import SeatsScroller from '../SeatsScroller/SeatsScroller.js';

function SeatsPanel() {
  return (
    <div className={classes.seats_panel}>
      <h3>Available Seats</h3>
      <h5>*Please note that regardless of what seat selections you make, we will reserve those seats in order of "<b>next available seat</b>".</h5>
        <div>
          <SeatsScroller/>
        </div>
    </div>
  );
}

export default SeatsPanel;

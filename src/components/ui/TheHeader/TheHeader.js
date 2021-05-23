import classes from './TheHeader.module.css';

function Header(props) {
  return (
    <header className={classes.header}>
      <div>
        <span className={classes.header_title}>{props.title}</span>
        {props.children}
      </div>
    </header>
  );
}

export default Header;

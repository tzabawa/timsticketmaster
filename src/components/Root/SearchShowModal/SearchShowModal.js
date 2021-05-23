import TheModal from '../../ui/TheModal/TheModal.js';
import ShowSearch from '../ShowSearch/ShowSearch.js';

function SearchShowModal(props) {
  const onShowSearchSubmitHander = () => {
    props.onSearchShowSubit();
  };

  return (
    <TheModal>
      <ShowSearch onShowSearchSubmit={onShowSearchSubmitHander}/>
    </TheModal>
  );
}

export default SearchShowModal;

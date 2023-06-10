import { Modal } from "react-bootstrap";
import { useHabitStore, useHabitEntryStore } from "../store/store";
import HabitContainer from "./HabitContainer";

interface HabitEntryModal {
  habitEntry: HabitEntry | undefined;
  hideModal: () => void;
}

function UpdateHabitEntryModal(props: HabitEntryModal) {
  const { getHabitById } = useHabitStore();
  if (!props.habitEntry) {
    return <></>;
  }
  const habit = getHabitById(props.habitEntry.habit_id);

  const closeModal = () => {
    props.hideModal();
  };

  return (
    <>
      <Modal.Body>
        <HabitContainer key={habit.id} {...habit} entry={props.habitEntry} />
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-primary mt-2" onClick={closeModal}>
          Close
        </button>
      </Modal.Footer>
    </>
  );
}

export default UpdateHabitEntryModal;

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Modal } from "react-bootstrap";
import UpdateHabitEntryModal from "../components/UpdateHabitEntryModal";

function StatsCalendar({ entries }: { entries: HabitEntry[] }) {
  const [tiles, setTiles] = useState(
    Array.from({ length: 30 }, (v, k) => {
      let yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      return {
        tileId: uuidv4(),
        timestamp: yesterday.getTime() - k * 86400000,
        complete: false,
        habitEntry: {
          timestamp: 0,
          id: "",
          habit_id: "",
          complete: false,
          count: 0,
        },
      };
    }).reverse()
  );

  // Variable to pass to modal for updating
  const [selectedHabitEntry, setSelectedHabitEntry] = useState<
    HabitEntry | undefined
  >();

  const [showModal, setShowModal] = useState(false);

  const hideModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    const newTiles = [...tiles].map((tile) => {
      const matchingEntry = [...entries].find(
        (entry) => entry.timestamp === tile.timestamp
      ) as HabitEntry | undefined;
      if (matchingEntry) {
        tile.complete = matchingEntry.complete;
        tile.habitEntry = matchingEntry;
      }
      return tile;
    });
    setTiles(newTiles);
  }, [entries]);

  const Tile = ({
    timestamp,
    complete,
    habitEntry,
  }: {
    timestamp: number;
    complete: boolean;
    habitEntry: HabitEntry | never;
  }) => {
    const date = new Date(timestamp);

    return (
      <div
        className={`stats-tile col-sm ${complete ? "complete" : ""}`}
        title={date.toDateString()}
        onClick={() => {
          setSelectedHabitEntry(() => habitEntry);
          setShowModal(!showModal);
        }}
      ></div>
    );
  };

  return (
    <div className="container">
      <div className="row">
        {tiles && tiles.map((tile, i) => <Tile key={tile.tileId} {...tile} />)}
      </div>
      {selectedHabitEntry && (
        <Modal.Dialog>
          <Modal show={showModal} onHide={hideModal} centered className="px-3">
            <UpdateHabitEntryModal
              hideModal={hideModal}
              habitEntry={selectedHabitEntry}
            />
          </Modal>
        </Modal.Dialog>
      )}
    </div>
  );
}

export default StatsCalendar;

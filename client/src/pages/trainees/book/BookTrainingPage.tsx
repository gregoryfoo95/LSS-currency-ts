import { useEffect, useState } from "react";
import getRequest from "../../../utilities/getRequest";
import { useParams } from "react-router-dom";
import TrainingCalendar from "./components/TrainingCalendar";
import dayjs from "dayjs";
import { Training } from "../../../@types/training";
import TrainingCard from "./components/TrainingCard";

const BookTrainingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [displayDate, setDisplayDate] = useState<Date>(new Date());
  const [displayTrainings, setDisplayTrainings] = useState<Training[]>([]);

  const { id, requirement } = useParams();

  useEffect(() => {
    getRequest(
      `/api/trainings/?trainee=${id}&requirement=${requirement}`,
      setTrainings
    ).then(() => {
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    const display = trainings.filter((t) =>
      dayjs(t.start).isSame(dayjs(displayDate), "day")
    );
    setDisplayTrainings(display);
  }, [displayDate, trainings]);

  const updateTraining = (newTraining: Training) => {
    setTrainings(
      trainings.map((t) => {
        if (t.id === newTraining.id) {
          return newTraining;
        }
        return t;
      })
    );
  };

  return (
    <>
      {isLoaded ? (
        <>
          <TrainingCalendar
            trainings={trainings}
            displayDate={displayDate}
            setDisplayDate={setDisplayDate}
          />
          {displayTrainings.map((t) => {
            return (
              <TrainingCard
                training={t}
                key={t.id}
                updateTraining={updateTraining}
              />
            );
          })}
          <p>{JSON.stringify(trainings)}</p>
        </>
      ) : (
        <progress />
      )}
    </>
  );
};

export default BookTrainingPage;

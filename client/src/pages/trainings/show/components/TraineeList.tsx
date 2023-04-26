import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getRequest from "../../../../utilities/getRequest";
import TraineeListRow from "./TraineeListRow";
import { Trainee } from "../../../../@types/trainee";

type Prop = {
  trainingComplete: boolean | undefined;
  setTrainingComplete: any;
};

const TraineeList = ({ trainingComplete, setTrainingComplete }: Prop) => {
  const { id: trainingId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [completedTrainees, setCompletedTrainees] = useState<number[]>([]);

  useEffect(() => {
    getRequest(`/api/trainees/?training=${trainingId}`, setTrainees).then(
      () => {
        setIsLoading(false);
      }
    );
  }, []);

  const handleCheck = (event: React.FormEvent<HTMLInputElement>) => {
    const { name, checked } = event.currentTarget;

    if (checked) {
      setCompletedTrainees([...completedTrainees, Number(name)]);
    } else {
      setCompletedTrainees(
        completedTrainees.filter((t) => {
          return t !== Number(name);
        })
      );
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("submit form");
    setIsLoading(true);
    await fetch(`/api/trainings/complete/${trainingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(completedTrainees),
    });
    await getRequest(`/api/trainees/?training=${trainingId}`, setTrainees);
    setCompletedTrainees([]);
    setTrainingComplete();
    setIsLoading(false);
  };

  return isLoading ? (
    <progress className="progress w-56" />
  ) : (
    <form onSubmit={handleSubmit}>
      <table className="table w-full">
        <thead className="bg-blue-500 text-black">
          <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
            Trainee
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider hidden md:table-cell">
            Category
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider hidden md:table-cell">
            Expiry
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
            Complete
          </th>
        </thead>
        <tbody>
          {trainees.map((t) => {
            return (
              <TraineeListRow
                trainee={t}
                key={t.id}
                handleChange={handleCheck}
                trainingComplete={trainingComplete}
              />
            );
          })}
        </tbody>
      </table>
      <button className="btn btn-sm" type="submit" disabled={trainingComplete}>
        {trainingComplete ? "Completed" : "Complete"}
      </button>
    </form>
  );
};

export default TraineeList;

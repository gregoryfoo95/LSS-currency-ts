import { Trainee } from "../../../../@types/trainee";
import TraineeTableRow from "./TraineeTableRow";

type Prop = {
  trainees: Trainee[];
  deleteTrainee: any;
};

const emptyStatus = {
  message: "",
  className: "",
};

const TraineesTable = ({ trainees, deleteTrainee }: Prop) => {
  return (
    <div className="overflow-y-auto overflow-x-hidden">
      <table className="table w-full">
        <thead className="bg-blue-500 text-black">
          <tr>
            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
              Callsign
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider hidden md:table-cell">
              Category
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium uppercase hidden sm:table-cell tracking-wider">
              Overall Status
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider hidden md:table-cell">
              Account Status
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {trainees?.map((t) => (
            <TraineeTableRow
              trainee={t}
              key={t.id}
              category={t.categories.name}
              overallStatus={t.status || emptyStatus}
              deleteTrainee={deleteTrainee}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TraineesTable;

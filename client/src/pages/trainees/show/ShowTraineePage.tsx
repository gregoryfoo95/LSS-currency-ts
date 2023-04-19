import { useEffect, useState } from "react";
import { Trainee, Currency } from "../../../@types/trainee";
import getRequest from "../../../utilities/getRequest";
import { useParams } from "react-router-dom";
import CurrencyCard from "./components/CurrencyCard";

const ShowTraineePage = () => {
  const { id } = useParams();
  const [trainee, setTrainee] = useState<Trainee | null>(null);
  const [fetchFlag, setFetchFlag] = useState<boolean>(false);

  useEffect(() => {
    getRequest(`/api/trainees/${id}`, setTrainee).then(() => {
      setFetchFlag(!fetchFlag);
    });
  }, []);

  return (
    <>
      <h1>{trainee?.callsign}</h1>
      <p>{trainee?.categories.name}</p>
      {trainee?.currencies.map((c) => {
        return <CurrencyCard currency={c} key={c.id} />;
      })}
      <hr />
      {JSON.stringify(trainee)}
    </>
  );
};

export default ShowTraineePage;
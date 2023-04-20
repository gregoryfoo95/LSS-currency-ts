import { useState, useEffect } from "react";
import getRequest from "../../../utilities/getRequest";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import TraineeParticularsFieldset from "../../../components/FormFieldsets/TraineeParticularsFieldset";
import { Trainee } from "../../../@types/trainee";
import CurrencyFieldset from "../../../components/FormFieldsets/CurrencyFieldset";
import dayjs from "dayjs";
import putRequest from "../../../utilities/putRequest";

const blankTrainee = {
  callsign: "",
  category: 0,
  id: 0,
  categories: { name: "" },
  user: 0,
  users: { approved: false },
  currencies: [],
};

const EditTraineePage = () => {
  const { id } = useParams();
  const [trainee, setTrainee] = useState<Trainee>(blankTrainee);
  const navigate = useNavigate();

  useEffect(() => {
    getRequest(`/api/trainees/${id}`, setTrainee);
  }, []);

  const handleSubmit = async () => {
    const response = (await putRequest(
      `/api/trainees/${id}`,
      trainee
    )) as Response;
    console.log(response);
    if (response.status === 200) {
      navigate("/trainees");
    } else {
      alert("Update unsuccessful. Please try again later");
    }
  };

  const handleTraineeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setTrainee({ ...trainee, [name]: value });
  };

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, name, value } = event.target;
    if (trainee.currencies.find((c) => c.id === Number(id))) {
      const updatedCurrencies = trainee.currencies.map((c) => {
        if (c.requirement === Number(id)) {
          c.expiry = dayjs(value).toDate();
        }
        return c;
      });
      console.log(updatedCurrencies);
      setTrainee({ ...trainee, currencies: updatedCurrencies });
    } else {
      const newCurrency = {
        requirement: Number(id),
        expiry: dayjs(value).toDate(),
      };
      const updatedCurrencies = [...trainee.currencies, newCurrency];
      setTrainee({ ...trainee, currencies: updatedCurrencies });
    }
  };

  return (
    <>
      {" "}
      Edit Trainee Form:
      <Formik initialValues={trainee} onSubmit={handleSubmit}>
        {({ isSubmitting, isValidating, isValid }) => (
          <Form>
            <TraineeParticularsFieldset
              trainee={trainee}
              handleChange={handleTraineeChange}
            />
            {trainee.categories.requirements?.map((r) => {
              const { requirements } = r;
              const currency = trainee.currencies.find(
                (c) => c.requirement === requirements.id
              );
              return (
                <CurrencyFieldset
                  key={r.requirements.id}
                  requirement={requirements}
                  currency={currency}
                  handleChange={handleCurrencyChange}
                />
              );
            })}
            <button type="submit">Update Trainee</button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default EditTraineePage;

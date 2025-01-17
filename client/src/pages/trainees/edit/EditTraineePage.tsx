import { useState, useEffect, useContext } from "react";
import getRequest from "../../../utilities/getRequest";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import { Trainee } from "../../../@types/trainee";
import putRequest from "../../../utilities/putRequest";
import ProgressBar from "../../../components/ProgressBar";
import { TitleContext } from "../../../App";
import TraineeFieldset from "../../../components/FormFieldsets/TraineeFieldset";
import { traineeSchema } from "../../../yupSchemas/traineeSchema";
import * as Yup from 'yup';

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
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [trainee, setTrainee] = useState<Trainee>(blankTrainee);
  const navigate = useNavigate();
  const setTitle = useContext<React.Dispatch<
    React.SetStateAction<string>
  > | null>(TitleContext);

  useEffect(() => {
    if (setTitle) setTitle("Edit Trainee");
    getRequest(`/api/trainees/${id}/?noTrim=true`, setTrainee).then(() => {
      if (setTitle) setTitle(trainee.callsign);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    const response = (await putRequest(
      `/api/trainees/${id}`,
      trainee
    )) as Response;
    setLoading(false);

    if (response.status === 200) {
      navigate("/trainees");
    } else {
      getRequest(`/api/trainees/${id}`, setTrainee);
      alert("Update unsuccessful. Please try again later");
    }
  };

  return (
    <fieldset className="justify-center">
      <div className="flex justify-center">
        {!loading ? (
          <Formik
            initialValues={trainee}
            enableReinitialize
            validationSchema={traineeSchema(trainee)}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValidating, isValid}) => (
              <Form className="space-y-6 text-center m-auto py-6">
                <TraineeFieldset
                  trainee={trainee}
                  setTrainee={setTrainee}
                />
                <button
                  disabled={isSubmitting || isValidating || !isValid}
                  className="btn btn-primary"
                  type="submit"
                >
                  Update Trainee
                </button>
              </Form>
            )}
          </Formik>
        ) : (
          <ProgressBar />
        )}
      </div>
    </fieldset>
  );
};

export default EditTraineePage;

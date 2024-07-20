import { FormEvent, useEffect, useState } from "react";
import Select from "react-select";
import { Plan, User } from "../../../../../types";
import { query, collection, getDocs, where, addDoc } from "firebase/firestore";
import { db } from "../../../../../firebase-setting";
import { useNavigate } from "react-router-dom";
import { SCREENS } from "../../../../../navigation/constant";

const CreateInvestmentForm = () => {
  const [plans, setPlans] = useState<Plan[]>([]);

  const [selectedPlan, updateSelectedPlan] = useState<Plan | null>(null);

  const [users, setUsers] = useState<User[]>([]);

  const [selectedUser, updateSelectedUser] = useState<User | null>(null);

  const navigate = useNavigate();

  const createInvestment = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      alert("You have to select a user to continue");
      return;
    }
    if (!selectedPlan) {
      alert("You have to select a plan to continue");
      return;
    }
    try {
      await addDoc(collection(db, "investments"), {
        user: {
          id: selectedUser?.id,
          email: selectedUser?.email,
          name: selectedUser?.name,
        },
        earnings: 0,
        capital: parseFloat(selectedPlan.price),
        plan: {
          id: selectedPlan.id,
          title: selectedPlan.title,
          ROI: selectedPlan.ROI,
          duration: selectedPlan.duration,
        },
        createAt: new Date().getTime().toString(),
        withdrawalDate:
          new Date().getTime() + 60 * 60 * 24 * selectedPlan.duration,
        status: "CREATED",
      });
      alert("Investment added");
      navigate(SCREENS.INVESTMENTS);
    } catch (error) {
      alert("error creating investment");
      // handle error later
      console.log(error);
    }
  };

  useEffect(() => {
    const set_up = async () => {
      const q = await query(collection(db, "plans"));
      const userQ = await query(
        collection(db, "users"),
        where("isAdmin", "==", false)
      );

      const docSnap = await getDocs(q);
      const userDocSnap = await getDocs(userQ);

      const _plans = docSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Plan[];

      const _users = userDocSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];

      setPlans(_plans);
      setUsers(_users);
    };

    set_up();
  }, []);

  return (
    <form
      onSubmit={createInvestment}
      className="form bg-white p-6 my-10 relative w-full"
    >
      <h3 className="text-2xl text-gray-900 font-semibold my-4">
        Create Investment
      </h3>
      <p className="text-gray-600 mb-2">
        {" "}
        Register a new Investment for a user
      </p>
      <div className="flex lg:space-x-5 mt-3 lg:flex-row flex-col justify-center items-center">
        <div className="lg:w-1/2 w-full">
          <Select
            placeholder="Select a user"
            options={users.map((user) => ({
              value: user.id,
              label: user.name,
            }))}
            onChange={(v) => {
              updateSelectedUser(
                users.find((_user) => _user.id === v?.value) as User
              );
            }}
          />
        </div>
        <div className="lg:w-1/2 w-full lg:my-0 my-2">
          <Select
            placeholder="Select Plan"
            options={plans.map((plan) => ({
              value: plan.id,
              label: plan.title,
            }))}
            onChange={(v) => {
              updateSelectedPlan(
                plans.find((_plan) => _plan.id === v?.value) as Plan
              );
            }}
          />
        </div>
      </div>

      <input
        type="submit"
        value="Submit"
        className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold p-3 cursor-pointer"
      />
    </form>
  );
};

export default CreateInvestmentForm;

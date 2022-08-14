import { useState } from "react";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import ReactSlider from "react-slider";

export const AddSpace: React.FC = () => {
  const [balance, setBalance] = useState(20000);
  const [form, setForm] = useState({ name: "", amount: 0, goal: "" });
  const [addForm, setAddForm] = useState(false);

  const { data: session } = useSession();

  const getSpaces = trpc.useQuery(["spaces.getAll"]);
  const addSpace = trpc.useMutation("spaces.addSpace", {
    onSuccess: () => getSpaces.refetch(),
  });

  const onAdd = () => {
    setAddForm(false);
    try {
      const amount = form.amount;
      const goal = form.goal.length > 0 ? parseFloat(form.goal) : null;

      addSpace.mutate({
        userId: session!.user!.id,
        name: form.name,
        amount: amount,
        goal: goal,
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (addSpace.isLoading) return <>ADDING</>;

  return (
    <>
      {addForm ? (
        <>
          <div>
            <input
              type="text"
              name="name"
              id="name"
              className="border block"
              placeholder="name"
              value={form.name}
              onChange={(e) =>
                setForm((prevState) => ({ ...prevState, name: e.target.value }))
              }
            />
            <ReactSlider
              className="max-w-[300px] m-auto pb-4"
              trackClassName="track top-2 h-1 first:bg-green-400 bg-green-100"
              thumbClassName="cursor-pointer bg-green-500 w-5 h-5 rounded-full outline-none"
              defaultValue={0}
              value={Math.floor((100 * form.amount) / balance)}
              onChange={(value) =>
                setForm((prevState) => ({
                  ...prevState,
                  amount: balance * value / 100,
                }))
              }
            />
            <input
              type="number"
              name="amount"
              id="amt"
              className="border block"
              placeholder="amount"
              value={form.amount}
              onChange={(e) =>
                setForm((prevState) => ({
                  ...prevState,
                  amount: parseFloat(e.target.value),
                }))
              }
            />
            <input
              type="text"
              name="goal"
              id="goal"
              className="border block"
              placeholder="goal"
              value={form.goal}
              onChange={(e) =>
                setForm((prevState) => ({ ...prevState, goal: e.target.value }))
              }
            />
            <button className="" onClick={onAdd}>
              Add Space
            </button>
          </div>
        </>
      ) : (
        <>
          <button
            onClick={() => setAddForm(true)}
            className="w-full h-full hover:bg-gray-100"
          >
            + Add Space
          </button>
        </>
      )}
    </>
  );
};

const Space: React.FC<{
  space: {
    name: string;
    amount: number;
    goal: number | null;
    id: string;
  };
}> = (props) => {
  const { space } = props;

  const getSpaces = trpc.useQuery(["spaces.getAll"]);
  const deleteSpace = trpc.useMutation("spaces.deleteSpace", {
    onSuccess: () => getSpaces.refetch(),
  });

  const onDelete = () => {
    try {
      deleteSpace.mutate(space.id);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {deleteSpace.isLoading ? (
        <>DELETING</>
      ) : (
        <>
          <p>{space.name}</p>
          <p>${space.amount}</p>
          <p>${space.goal}</p>
          <button
            onClick={onDelete}
            className="border p-2 rounded hover:bg-gray-100"
          >
            Delete space
          </button>
        </>
      )}
    </>
  );
};

export default Space;

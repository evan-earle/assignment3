import { useForm } from "react-hook-form";
import { useEffect } from "react";

const PlayerForm = ({ onDataCollected, initialData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    if (initialData) {
      setValue("name", initialData?.name);
      setValue("team", initialData?.team);
      setValue("age", initialData?.age);
      setValue("position", initialData?.position);
      setValue("nationality", initialData?.nationality);
      setValue("goals", initialData?.stats.goals);
      setValue("assists", initialData?.stats.assists);
      setValue("points", initialData?.stats.points);
      setValue("awards", initialData?.awards);
    }
  }, [initialData]);

  return (
    <div>
      <form onSubmit={handleSubmit(onDataCollected)} className="space-y-4">
        <div>
          <input
            {...register("name", { required: "name is required!" })}
            type="text"
            placeholder="Player"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <input
            {...register("team", { required: "team is required!" })}
            type="text"
            placeholder="Team"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.team && (
            <p className="text-red-500 text-sm mt-1">{errors.team.message}</p>
          )}
        </div>
        <div>
          <input
            {...register("age", { required: "Year is required!" })}
            type="number"
            min="17"
            max="50"
            placeholder="Age"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.age && (
            <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
          )}
        </div>
        <div>
          <input
            {...register("position", { required: "position is required!" })}
            type="text"
            placeholder="Position"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.position && (
            <p className="text-red-500 text-sm mt-1">
              {errors.position.message}
            </p>
          )}
        </div>
        <div>
          <input
            {...register("nationality", {
              required: "nationality is required!",
            })}
            type="text"
            placeholder="Nationality"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.nationality && (
            <p className="text-red-500 text-sm mt-1">
              {errors.nationality.message}
            </p>
          )}
        </div>
        <div>
          <input
            {...register("goals", {
              required: "goals is required!",
            })}
            type="number"
            placeholder="Goals"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.goals && (
            <p className="text-red-500 text-sm mt-1">{errors.goals.message}</p>
          )}
        </div>
        <div>
          <input
            {...register("assists", {
              required: "assists is required!",
            })}
            type="number"
            placeholder="Assists"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.assists && (
            <p className="text-red-500 text-sm mt-1">
              {errors.assists.message}
            </p>
          )}
        </div>
        <div>
          <input
            {...register("points", {
              required: "points is required!",
            })}
            type="number"
            placeholder="Points"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.points && (
            <p className="text-red-500 text-sm mt-1">{errors.points.message}</p>
          )}
        </div>
        <div>
          <input
            {...register("awards", {
              required: "awards is required!",
            })}
            type="text"
            placeholder="Awards"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.awards && (
            <p className="text-red-500 text-sm mt-1">{errors.awards.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all"
        >
          Submit Player
        </button>
      </form>
    </div>
  );
};
export default PlayerForm;

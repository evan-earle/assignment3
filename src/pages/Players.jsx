import { useQuery } from "@tanstack/react-query";
import PlayerTable from "../components/players/PlayerTable";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Players = () => {
  const location = useLocation();

  const {
    isPending,
    error,
    data: players,
  } = useQuery({
    queryKey: ["playersData"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_PLAYERS_API_URL}`);
      const data = await response.json();

      return data;
    },
    staleTime: Infinity,
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Players</h1>

      {location.pathname === "/admin/players" ? (
        isPending ? (
          <p>Loading...</p>
        ) : (
          <PlayerTable players={players} />
        )
      ) : (
        <Outlet />
      )}
    </div>
  );
};
export default Players;

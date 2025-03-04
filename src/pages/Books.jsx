import { useQuery } from "@tanstack/react-query";
import BooksTable from "../components/books/BooksTable";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Books = () => {
  const location = useLocation();

  const {
    isPending,
    error,
    data: books,
  } = useQuery({
    queryKey: ["booksData"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_BOOKS_API_URL}`);

      return response.json();
    },
    staleTime: Infinity,
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Books</h1>

      {location.pathname === "/admin/books" ? (
        isPending ? (
          <p>Loading...</p>
        ) : (
          <BooksTable books={books} />
        )
      ) : (
        <Outlet />
      )}
    </div>
  );
};
export default Books;

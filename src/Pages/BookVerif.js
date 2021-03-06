import React from "react";
import { Link } from "react-router-dom";
import { FcApproval } from "react-icons/fc";
import { FaTrashAlt } from "react-icons/fa"
import { useQuery, useMutation } from "react-query";
import { API } from "../Config/Api";
import LoadingScreen from "../Component/LoadingScreen";

export default function BookVerif() {
  const { loading, error, data: books, refetch } = useQuery(
    "getBooksData",
    async () => await API.get("/books")
  );

  const [handleApprove] = useMutation(async (id) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };

      const body = JSON.stringify({ status: "Approved" })
      const res = await API.patch(`/book/${id}`, body, config)
      refetch();
      alert(res.data.message);
    } catch (error) {
      console.log(error.message);
    }
  });

  const [handleCancel] = useMutation(async (id) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };

      const body = JSON.stringify({ status: "Canceled" })
      const res = await API.patch(`/book/${id}`, body, config)
      refetch();
      alert(res.data.message);
    } catch (error) {
      console.log(error.message);
    }
  });

  const [handleDelete] = useMutation(async (id) => {
    try {
      const res = await API.delete(`/book/${id}`)
      refetch();
      alert(res.data.message);
    } catch (error) {
      console.log(error.message);
    }
  });

  if (loading || !books) {
    return error ? (
      <h1>error {error.message} </h1>
    ) : <LoadingScreen />;
  } else {
    let bookData = books.data.data;

    return (
      <div className="table-responsive">
        <h4 className="list-title" style={{ padding: 0 }}>
          Book Verification
      </h4>
        <table className="table table-hovered table-striped table-sm mt-4">
          <thead>
            <tr>
              <th>No</th>
              <th>Users or Author</th>
              <th>ISBN</th>
              <th>E-book</th>
              <th>Status</th>
              <th>
                <center>Action</center>
              </th>
              <th>
                <center>Delete</center>
              </th>
            </tr>
          </thead>
          <tbody>
            {bookData.map((book, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>{book.author.fullName}</td>
                <td>{book.isbn}</td>
                <td style={{ fontSize: 12, fontWeight: 700 }}>
                  <Link to={`/Read/${book.id}`}>
                    {book.fileUrl.split("/")[book.fileUrl.split("/").length - 1]}
                  </Link>
                </td>
                {book.status === "Approved" ? (
                  <>
                    <td
                      className="text-success"
                      style={{ fontSize: 12, fontWeight: 700 }}
                    >
                      {book.status}
                    </td>
                    <td>
                      <center>
                        <FcApproval size="30" />
                      </center>
                    </td>
                  </>
                ) : (
                    <>
                      <td
                        className={
                          book.status === "Canceled"
                            ? "text-danger"
                            : "text-warning"
                        }
                        style={{ fontSize: 12, fontWeight: 700 }}
                      >
                        {book.status}
                      </td>
                      <td>
                        <center>
                          {book.status !== "Canceled" && (
                            <button
                              onClick={() => handleCancel(book.id)}
                              className="btn btn-danger"
                            >
                              Cancel
                            </button>
                          )}{" "}
                          <button
                            onClick={() => handleApprove(book.id)}
                            className="btn btn-success"
                          >
                            Approve
                      </button>
                        </center>
                      </td>
                    </>
                  )}
                <td>
                  <center>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="btn btn-secondary"
                    >
                      <FaTrashAlt />
                    </button>
                  </center>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
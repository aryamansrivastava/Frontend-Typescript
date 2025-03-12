import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { setUsers, setTotalUsers } from "../redux/slices/userSlice";
import { getAllUsers } from "../api/api";
import { toast } from "react-toastify";

const useUsers = (
  pagination: { pageIndex: number; pageSize: number },
  globalFilter: string,
  showUsers: boolean
) => {
  const dispatch = useDispatch<AppDispatch>();

  const users = useSelector((state: RootState) => state.users.users);
  const totalUsers = useSelector((state: RootState) => state.users.totalUsers);
  const isLoading = useSelector((state: RootState) => state.users.loading);

  const fetchUsers = useCallback(async () => {
    if (!showUsers) return;

    try {
      const page = pagination.pageIndex + 1;
      const pageSize = pagination.pageSize;
      const response = await getAllUsers(page, pageSize, globalFilter);

      const cachedUsers = useSelector((state: RootState) => state.users[page]);
      if (cachedUsers) {
        dispatch(setUsers(cachedUsers));
        return;
    }
      dispatch(setUsers(response.data));
      // dispatch(setTotalUsers(response.totalUsers));
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    }
  }, [dispatch, pagination, globalFilter]);

  //  useEffect(() => {
  //   fetchUsers();
  // }, [fetchUsers]);

  return { users, totalUsers, isLoading, fetchUsers };
};

export default useUsers;
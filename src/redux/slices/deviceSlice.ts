import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Device {
  id: number;
  name: string;
  userId: number;
}

interface DeviceState {
  devices: Device[];
  loading: boolean;
  error: string | null;
}

const initialState: DeviceState = {
  devices: [],
  loading: false,
  error: null,
};

export const fetchDevices = createAsyncThunk(
  "device/fetchDevices",
  async (userId: number) => {
    const response = await axios.get<{ devices: Device[] }>(`/api/devices/${userId}`);
    return response.data.devices; 
  }
);

export const addDevice = createAsyncThunk(
  "device/addDevice",
  async (deviceData: { name: string; userId: number }) => {
    const response = await axios.post<{ device: Device }>("/api/devices", deviceData);
    return response.data.device; 
  }
);

const deviceSlice = createSlice({
    name: "device",
    initialState,
    reducers: {
        setDevices(state, action: PayloadAction<Device[]>) {
            state.devices = action.payload;
        },
        addNewDevice(state, action: PayloadAction<Device>){
            state.devices.push(action.payload);
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
    },
});

export const {setDevices, addNewDevice, setLoading} = deviceSlice.actions;
export default deviceSlice.reducer;
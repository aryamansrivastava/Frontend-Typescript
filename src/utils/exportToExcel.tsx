import { format } from "date-fns";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportToExcel = async (allUsers) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    worksheet.columns = [
        { header: "First Name", key: "firstName", width: 20 },
        { header: "Last Name", key: "lastName", width: 20 },
        { header: "Email", key: "email", width: 30 },
        { header: "Last Login Time", key: "lastLoginTime", width: 25 },
        { header: "Last Device Used", key: "lastDeviceUsed", width: 20 }
    ];

    worksheet.getRow(1).font = { bold: true };

    allUsers.forEach(user => {
        worksheet.addRow({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            lastLoginTime: user.Sessions?.length > 0 && user.Sessions?.[0]?.start_time
                ? format(new Date(user.Sessions[0].start_time), 'dd/MM/yyyy HH:mm')
                : "No Session",
            lastDeviceUsed: user.Devices?.[0]?.name || "No Device"
        });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const file = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(file, "UserList.xlsx");
};
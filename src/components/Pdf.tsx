import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import{ format } from "date-fns";

export const exportToPDF = (users) => {
    const doc = new jsPDF();
    doc.text('User List', 14, 20);

    autoTable(doc, {
        startY: 30,
    head: [['First Name', 'Last Name', 'Email', 'Last Login Time', 'Last Device Used']],
    body: users.map(user => [
        user.firstName,
        user.lastName,
        user.email,
        user.Sessions?.length > 0 && user.Sessions?.[0]?.start_time 
        ? format(new Date(user.Sessions[0].start_time),'dd/MM/yyyy HH:mm')
        : 'No Session',
        user.Devices?.[0]?.name || 'No Device'
    ]),
    styles: {
        fontSize: 10,
        textColor: [0, 0, 0],
        lineWidth: 0.1,
        lineColor: [200, 200, 200]
    },
    headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontSize: 10,
        fontStyle: 'bold'
    },
    bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
    }
    });
    doc.save('UserList.pdf');
};
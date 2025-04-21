import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Users } from "lucide-react";

function InstructorDashboard({ listOfCourses }) {
  function calculateTotalStudentsAndProfit() {
    const { totalStudents, totalProfit, studentList } = listOfCourses.reduce(
      (acc, course) => {
        const studentCount = course.students.length;
        acc.totalStudents += studentCount;
        acc.totalProfit += course.pricing * studentCount;

        course.students.forEach((student) => {
          acc.studentList.push({
            courseTitle: course.title,
            studentName: student.studentName,
            studentEmail: student.studentEmail,
          });
        });

        return acc;
      },
      {
        totalStudents: 0,
        totalProfit: 0,
        studentList: [],
      }
    );

    return {
      totalProfit,
      totalStudents,
      studentList,
    };
  }

  const { totalStudents, totalProfit, studentList } = calculateTotalStudentsAndProfit();

  const config = [
    {
      icon: Users,
      label: "Total Students",
      value: totalStudents,
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `$${totalProfit.toLocaleString()}`,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {config.map((item, index) => (
          <Card key={index} className="shadow-lg rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">{item.label}</CardTitle>
              <item.icon className="h-6 w-6 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Students List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="w-full border border-gray-200 rounded-lg">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="p-4 font-semibold text-gray-700">Course Name</TableHead>
                  <TableHead className="p-4 font-semibold text-gray-700">Student Name</TableHead>
                  <TableHead className="p-4 font-semibold text-gray-700">Student Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentList.length > 0 ? (
                  studentList.map((studentItem, index) => (
                    <TableRow key={index} className="border-b hover:bg-gray-50">
                      <TableCell className="p-4 text-gray-800 font-medium">{studentItem.courseTitle}</TableCell>
                      <TableCell className="p-4 text-gray-600">{studentItem.studentName}</TableCell>
                      <TableCell className="p-4 text-gray-600">{studentItem.studentEmail}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="p-4 text-center text-gray-500">
                      No students enrolled yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default InstructorDashboard;
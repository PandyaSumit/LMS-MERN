import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { Delete, Edit, PlusCircle } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

function InstructorCourses({ listOfCourses }) {
  const navigate = useNavigate();
  const {
    setCurrentEditedCourseId,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
  } = useContext(InstructorContext);
console.log('listOfCourses', listOfCourses)
  return (
    <Card>
      <CardHeader className="flex justify-between flex-row items-center">
        <CardTitle className="text-3xl font-extrabold">All Courses</CardTitle>
        <Button
          onClick={() => {
            setCurrentEditedCourseId(null);
            setCourseLandingFormData(courseLandingInitialFormData);
            setCourseCurriculumFormData(courseCurriculumInitialFormData);
            navigate("/instructor/create-new-course");
          }}
          className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <PlusCircle className="h-5 w-5" />
          Create New Course
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="w-full border border-gray-200">
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="px-4 py-2 text-left">Course</TableHead>
                <TableHead className="px-4 py-2 text-left">Students</TableHead>
                <TableHead className="px-4 py-2 text-left">Revenue</TableHead>
                <TableHead className="px-4 py-2 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listOfCourses && listOfCourses.length > 0 ? (
                listOfCourses.map((course) => (
                  <TableRow key={course?._id} className="border-b">
                    <TableCell className="px-4 py-3 font-medium">
                      {course?.title}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {course?.students?.length}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      ${course?.students?.length>0 ? course?.pricing*course?.students?.length : course?.pricing}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right space-x-2">
                      <Button
                        onClick={() => {
                          navigate(`/instructor/edit-course/${course?._id}`);
                        }}
                        variant="ghost"
                        size="sm"
                        className="hover:bg-gray-200"
                      >
                        <Edit className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-red-200"
                      >
                        <Delete className="h-5 w-5 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan="4"
                    className="text-center py-4 text-gray-500"
                  >
                    No courses available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default InstructorCourses;

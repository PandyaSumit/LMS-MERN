import { courseCategories } from "@/config";
import { FaBookOpen, FaCode, FaBusinessTime, FaMusic } from "react-icons/fa";
import banner from "../../../../public/banner-img.png";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";

const categoryIcons = {
  coding: <FaCode className="text-3xl text-blue-600" />,
  business: <FaBusinessTime className="text-3xl text-green-600" />,
  music: <FaMusic className="text-3xl text-purple-600" />,
  others: <FaBookOpen className="text-3xl text-yellow-600" />,
};

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleNavigateToCoursesPage(getCurrentId) {
    console.log(getCurrentId);
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate("/courses");
  }

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService();
    if (response?.success) setStudentViewCoursesList(response?.data);
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );

    if (response?.success) {
      if (response?.data) {
        navigate(`/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/course/details/${getCurrentCourseId}`);
      }
    }
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="flex flex-col lg:flex-row items-center justify-between py-12 px-6 lg:px-12 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        {/* Left Section: Text Content */}
        <div className="lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
          <h1 className="text-5xl font-extrabold leading-tight mb-4">
            Unlock Your Potential with <span className="text-yellow-300">Expert-Led Learning</span>
          </h1>
          <p className="text-lg">
            Gain skills for today and the future. Start your journey with us and transform your career.
          </p>
          <Button className="mt-6 px-6 py-3 text-lg bg-yellow-400 hover:bg-yellow-500 rounded-lg" onClick={() => navigate("/courses")}>Get Started</Button>
        </div>

        {/* Right Section: Image */}
        <div className="lg:w-1/2 flex justify-center">
          <img
            src={banner}
            alt="Learning Banner"
            className="w-full max-w-lg h-auto rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      </section>

      <section className="py-12 px-4 lg:px-12 bg-white">
        <h2 className="text-4xl font-bold mb-8 text-center text-gray-900">Explore Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {courseCategories.map((categoryItem) => (
            <div
              key={categoryItem.id}
              className="bg-gray-100 p-6 rounded-xl shadow-md flex flex-col items-center transition-transform transform hover:scale-110 cursor-pointer border border-gray-200 hover:border-blue-500 hover:shadow-lg"
              onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
            >
              {categoryIcons[categoryItem.icon] || categoryIcons.others}
              <h3 className="text-lg font-semibold mt-4 text-gray-800">{categoryItem.label}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 px-4 lg:px-12">
  <h2 className="text-4xl font-bold mb-8 text-center text-gray-900">Featured Courses</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
    {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
      studentViewCoursesList.map((courseItem) => (
        <div
          key={courseItem?._id}
          onClick={() => handleCourseNavigate(courseItem?._id)}
          className="border rounded-2xl overflow-hidden shadow-md cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl bg-white relative"
        >
          {/* Course Image with Overlay */}
          <div className="relative w-full">
            <img
              src={courseItem?.image}
              alt={courseItem?.title}
              className="w-full h-48 md:h-52 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          </div>
          <div className="p-4 md:p-6">
            <h3 className="font-bold text-lg md:text-xl text-gray-900">{courseItem?.title}</h3>
            <p className="text-sm md:text-base text-gray-600 mt-1">{courseItem?.instructorName}</p>

            <div className="mt-2 flex items-center justify-between">
              <span className="font-semibold text-lg text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                ${courseItem?.pricing}
              </span>
            </div>
            <button
              className="mt-4 md:mt-5 px-4 py-2 md:px-5 md:py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium rounded-lg w-full hover:from-blue-600 hover:to-blue-800 transition-all duration-300"
            >
              View Course
            </button>
          </div>
        </div>
      ))
    ) : (
      <h1 className="text-center text-gray-500">No Courses Found</h1>
    )}
  </div>
</section>



    </div>
  );
}

export default StudentHomePage;
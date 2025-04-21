import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
    checkCoursePurchaseInfoService,
    fetchStudentViewCourseListService,
} from "@/services";
import { ArrowUpDownIcon, FilterIcon, XIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function StudentViewCoursesPage() {
    const [sort, setSort] = useState("price-lowtohigh");
    const [filters, setFilters] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const {
        studentViewCoursesList,
        setStudentViewCoursesList,
        loadingState,
        setLoadingState,
    } = useContext(StudentContext);
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);

    function handleFilterOnChange(sectionId, option) {
        setFilters((prev) => {
            const updatedFilters = { ...prev };
            if (!updatedFilters[sectionId]) updatedFilters[sectionId] = [];

            const index = updatedFilters[sectionId].indexOf(option.id);
            if (index === -1) updatedFilters[sectionId].push(option.id);
            else updatedFilters[sectionId].splice(index, 1);

            sessionStorage.setItem("filters", JSON.stringify(updatedFilters));
            return { ...updatedFilters };
        });
    }

    async function fetchAllStudentViewCourses(filters, sort) {
        const query = new URLSearchParams({
            ...filters,
            sortBy: sort,
        });
        const response = await fetchStudentViewCourseListService(query);
        if (response?.success) {
            setStudentViewCoursesList(response?.data);
            setLoadingState(false);
        }
    }

    async function handleCourseNavigate(courseId) {
        const response = await checkCoursePurchaseInfoService(courseId, auth?.user?._id);
        navigate(response?.data ? `/course-progress/${courseId}` : `/course/details/${courseId}`);
    }

    useEffect(() => {
        setSearchParams(new URLSearchParams(filters));
    }, [filters]);

    useEffect(() => {
        setSort("price-lowtohigh");
        setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
    }, []);

    useEffect(() => {
        if (filters && sort) fetchAllStudentViewCourses(filters, sort);
    }, [filters, sort]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">All Courses</h1>
            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar Toggle Button for Mobile */}
                <Button
                    variant="outline"
                    className="md:hidden flex items-center gap-2"
                    onClick={() => setIsSidebarOpen(true)}
                >
                    <FilterIcon className="h-5 w-5" /> Filters
                </Button>

                {/* Sidebar */}
                <aside className={`fixed md:relative top-0 left-0 h-full w-64 bg-white p-5 border-r z-50 shadow-lg md:shadow-none ${isSidebarOpen ? "block" : "hidden md:block"}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">Filters</h2>
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
                            <XIcon className="h-5 w-5" />
                        </Button>
                    </div>
                    {Object.keys(filterOptions).map((section) => (
                        <div key={section} className="mb-4">
                            <h3 className="text-md font-semibold mb-2">{section.toUpperCase()}</h3>
                            <div className="space-y-2">
                                {filterOptions[section].map((option) => (
                                    <Label key={option.id} className="flex items-center gap-2 cursor-pointer">
                                        <Checkbox
                                            checked={filters[section]?.includes(option.id)}
                                            onCheckedChange={() => handleFilterOnChange(section, option)}
                                        />
                                        {option.label}
                                    </Label>
                                ))}
                            </div>
                        </div>
                    ))}
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="flex items-center gap-2 p-3">
                                    <ArrowUpDownIcon className="h-4 w-4" />
                                    <span className="text-[16px] font-medium">Sort By</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                                    {sortOptions.map((sortItem) => (
                                        <DropdownMenuRadioItem key={sortItem.id} value={sortItem.id}>
                                            {sortItem.label}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <span className="text-sm text-black font-bold">
                            {studentViewCoursesList.length} Results
                        </span>
                    </div>

                    {/* Course List */}
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
                            studentViewCoursesList.map((course) => (
                                <Card
                                    key={course._id}
                                    onClick={() => navigate(`/course/details/${course?._id}`)}
                                    className="cursor-pointer transition-shadow hover:shadow-lg rounded-2xl overflow-hidden bg-white shadow-md flex flex-col"
                                >
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="w-full h-40 sm:h-48 md:h-52 lg:h-56 object-cover"
                                    />
                                    <CardContent className="p-4 sm:p-5 md:p-6 flex flex-col flex-1 justify-between">
                                        <div>
                                            <CardTitle className="text-base sm:text-lg font-semibold mb-2">{course.title}</CardTitle>
                                            <p className="text-sm text-gray-600">{course.instructorName}</p>
                                            <p className="text-xs sm:text-sm text-gray-500">
                                                {course.curriculum?.length} Lectures • {course.level}
                                            </p>
                                        </div>
                                        <p className="font-bold text-base sm:text-lg mt-2">${course.pricing}</p>
                                    </CardContent>
                                </Card>

                            ))
                        ) : loadingState ? (
                            <Skeleton className="h-40 w-full" />
                        ) : (
                            <h1 className="font-extrabold text-xl">No Courses Found</h1>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default StudentViewCoursesPage;
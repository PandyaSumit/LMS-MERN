import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
    checkCoursePurchaseInfoService,
    createPaymentService,
    fetchStudentViewCourseDetailsService,
} from "@/services";
import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function StudentViewCourseDetailsPage() {
    const {
        studentViewCourseDetails,
        setStudentViewCourseDetails,
        currentCourseDetailsId,
        setCurrentCourseDetailsId,
        loadingState,
        setLoadingState,
    } = useContext(StudentContext);

    const { auth } = useContext(AuthContext);

    const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
        useState(null);
    const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
    const [approvalUrl, setApprovalUrl] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

    async function fetchStudentViewCourseDetails() {
        // const checkCoursePurchaseInfoResponse =
        //   await checkCoursePurchaseInfoService(
        //     currentCourseDetailsId,
        //     auth?.user._id
        //   );

        // if (
        //   checkCoursePurchaseInfoResponse?.success &&
        //   checkCoursePurchaseInfoResponse?.data
        // ) {
        //   navigate(`/course-progress/${currentCourseDetailsId}`);
        //   return;
        // }

        const response = await fetchStudentViewCourseDetailsService(
            currentCourseDetailsId
        );

        if (response?.success) {
            setStudentViewCourseDetails(response?.data);
            setLoadingState(false);
        } else {
            setStudentViewCourseDetails(null);
            setLoadingState(false);
        }
    }

    function handleSetFreePreview(getCurrentVideoInfo) {
        setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
    }

    async function handleCreatePayment() {
        const paymentPayload = {
            userId: auth?.user?._id,
            userName: auth?.user?.userName,
            userEmail: auth?.user?.userEmail,
            orderStatus: "pending",
            paymentMethod: "paypal",
            paymentStatus: "initiated",
            orderDate: new Date(),
            paymentId: "",
            payerId: "",
            instructorId: studentViewCourseDetails?.instructorId,
            instructorName: studentViewCourseDetails?.instructorName,
            courseImage: studentViewCourseDetails?.image,
            courseTitle: studentViewCourseDetails?.title,
            courseId: studentViewCourseDetails?._id,
            coursePricing: studentViewCourseDetails?.pricing,
        };

        console.log(paymentPayload, "paymentPayload");
        const response = await createPaymentService(paymentPayload);

        if (response.success) {
            sessionStorage.setItem(
                "currentOrderId",
                JSON.stringify(response?.data?.orderId)
            );
            setApprovalUrl(response?.data?.approveUrl);
        }
    }

    useEffect(() => {
        if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
    }, [displayCurrentVideoFreePreview]);

    useEffect(() => {
        if (currentCourseDetailsId !== null) fetchStudentViewCourseDetails();
    }, [currentCourseDetailsId]);

    useEffect(() => {
        if (id) setCurrentCourseDetailsId(id);
    }, [id]);

    useEffect(() => {
        if (!location.pathname.includes("course/details"))
            setStudentViewCourseDetails(null),
                setCurrentCourseDetailsId(null),
                setCoursePurchaseId(null);
    }, [location.pathname]);

    if (loadingState) return <Skeleton />;

    if (approvalUrl !== "") {
        window.location.href = approvalUrl;
    }

    const getIndexOfFreePreviewUrl =
        studentViewCourseDetails !== null
            ? studentViewCourseDetails?.curriculum?.findIndex(
                (item) => item.freePreview
            )
            : -1;
    console.log('getIndexOfFreePreviewUrl', studentViewCourseDetails?.curriculum)

    return (
        <div className=" mx-auto p-4">
            <div className="bg-gradient-to-r from-indigo-800 to-purple-800 text-white p-10 rounded-lg shadow-lg">
                <h1 className="text-4xl font-extrabold mb-3">{studentViewCourseDetails?.title}</h1>
                <p className="text-xl opacity-90 mb-4">{studentViewCourseDetails?.subtitle}</p>
                <div className="flex flex-wrap gap-4 text-sm text-white/80">
                    <span>👨‍🏫 {studentViewCourseDetails?.instructorName}</span>
                    <span>📅 {studentViewCourseDetails?.date?.split("T")[0]}</span>
                    <span className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        {studentViewCourseDetails?.primaryLanguage}
                    </span>
                    <span>👥 {studentViewCourseDetails?.students?.length || 0} Students</span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 mt-8">
                <main className="flex-grow">
                    <Card className="mb-8 shadow-md border border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-2xl font-semibold text-gray-800">What you'll learn</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                                {studentViewCourseDetails?.objectives
                                    .split(",")
                                    .map((objective, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <CheckCircle className="text-green-600 h-5 w-5 mt-1" />
                                            <span>{objective.trim()}</span>
                                        </li>
                                    ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="mb-8 border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl font-semibold text-gray-800">Course Curriculum</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {studentViewCourseDetails?.curriculum?.map((item, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center p-3 rounded-md transition-all duration-200 ${item.freePreview
                                        ? "hover:bg-indigo-50 cursor-pointer"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        }`}
                                    onClick={item.freePreview ? () => handleSetFreePreview(item) : null}
                                >
                                    {item.freePreview ? (
                                        <PlayCircle className="text-indigo-600 mr-2" />
                                    ) : (
                                        <Lock className="mr-2" />
                                    )}
                                    <span>{item.title}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                </main>
                <aside className="w-full md:w-[500px]">
                    <Card className="sticky top-4 shadow-lg border border-gray-200">
                        <CardContent className="p-6">
                            <div className="aspect-video mb-4 overflow-hidden rounded-md border border-gray-300">
                                <VideoPlayer
                                    url={
                                        getIndexOfFreePreviewUrl !== -1
                                            ? studentViewCourseDetails?.curriculum[getIndexOfFreePreviewUrl].videoUrl
                                            : ""
                                    }
                                    width="100%"
                                    height="100%"
                                />
                            </div>
                            <div className="mb-4 text-3xl font-bold text-indigo-700">
                                ${studentViewCourseDetails?.pricing}
                            </div>
                            <Button
                                onClick={handleCreatePayment}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg"
                            >
                                Buy Now
                            </Button>
                        </CardContent>
                    </Card>

                </aside>
            </div>
            <Dialog
                open={showFreePreviewDialog}
                onOpenChange={() => {
                    setShowFreePreviewDialog(false);
                    setDisplayCurrentVideoFreePreview(null);
                }}
            >
                <DialogContent className="w-[800px] bg-white rounded-lg shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-800">Course Preview</DialogTitle>
                    </DialogHeader>
                    <div className="aspect-video rounded-lg mb-4 overflow-hidden">
                        <VideoPlayer
                            url={displayCurrentVideoFreePreview}
                            width="100%"
                            height="100%"
                        />
                    </div>
                    <div className="flex flex-col gap-2 text-indigo-700 font-medium">
                        {studentViewCourseDetails?.curriculum
                            ?.filter((item) => item.freePreview)
                            .map((item) => (
                                <p
                                    onClick={() => handleSetFreePreview(item)}
                                    className="cursor-pointer hover:underline"
                                >
                                    {item?.title}
                                </p>
                            ))}
                    </div>
                    <DialogFooter className="sm:justify-start mt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>

            </Dialog>
        </div>
    );
}

export default StudentViewCourseDetailsPage;
